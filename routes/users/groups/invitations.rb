require "base64"

get '/users/:user_id/groups/:group_id/invitations', auth: [] do |_, group_id|

  group = begin
    @user.groups.find(group_id)
  rescue Mongoid::Errors::DocumentNotFound
    return empty_response
  end
  
  invitations = {}
  
  group.invitations.each do |invitation|
    
    # Current user is the invitee
    if invitation.state == 3 &&
       invitation.invitee_id == @user.id.to_s &&
       !invitation.ack_integrate
    
      invitations[:integrate] = {
        id: invitation.id.to_s,
        group_id: invitation.group.id.to_s,
        request: invitation.integrate
      }
      
    # Invite has been accepted
    elsif invitation.state > 2  &&
      
      # Current user is not inviter
      invitation.inviter_id != @user.id.to_s &&  
      # Current user is not invitee
      invitation.invitee_id != @user.id.to_s && 
      invitation.distribute && 
      !invitation.ack_distribute.include?(@user.id.to_s)

      invitations[:distribute] ||= []
      
      invitations[:distribute] << {
        id: invitation.id.to_s,
        request: invitation.distribute
      }
        
    end
    
  end
  
  invitations.to_json
  
end

post '/invitations', auth: [] do

  invitation = get_model(request)
  
  if !invitation.group_id || 
     !invitation.email ||
     !invitation.request
    error 400, 'missing_params'
  end
  
  @group = @user.groups.find(invitation.group_id)

  return { status: 'own_email' }.to_json if
    invitation.email == @user.email

  token = SecureRandom.uuid

  invitation = @group.invitations.create!(
    inviter_id: @user.id.to_s,
    privileges: :none, token: token,
    request: invitation.request,
    email: invitation.email
  )

  invitation.save!

  track @user, 'Invited a new group member'
  
  send_invite(invitation.email, token)

  { status: 'ok', token: token }.to_json

end

put '/invitations', auth: [] do
  
  params = get_model(request)
  
  error 400, 'missing_params' if !params._id
  
  invitation = begin
    Invitation.find(params._id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'invitation_not_found'
  end

  if params.accept && invitation.state == 1
    
    invitation.invitee_id = @user.id.to_s
    invitation.accept = params.accept
    invitation.state = 2
    invitation.save!
    
    request_confirm(invitation)
    
  elsif params.integrate && params.distribute &&
        invitation.state == 2
  
    invitation.integrate = params.integrate
    
    unless params.distribute == 'e30='
      invitation.distribute = params.distribute
    end
    
    invitation.state = 3
    invitation.save!
    
    group   = invitation.group
    invitee = invitation.invitee
    inviter = invitation.inviter

    notify_confirmed(invitation)

    membership = Membership.create

    group.memberships << membership
    group.users << invitee
    group.save!

    invitee.memberships << membership

    invitee.save!

    track @user, 'Confirmed a new group member'
    
    notify_confirmed(invitation)
    
  elsif params.completed
    
    invitation.state = 4
    invitation.save!
  
  elsif params.transfer
    
    keys = JSON.parse(Base64.
      strict_decode64(params.transfer))

    invitee_id = invitation.invitee.id.to_s
    group = invitation.group
    
    keys['posts'].each do |post_info|

      post = group.posts.find(post_info['id'])
      post.keys[invitee_id] = post_info['key']

      post_info['comments'].each do |comment_info|

        comment = post.comments.find(comment_info['id'])
        comment.keys[invitee_id] = comment_info['key']

        comment.save!
        
      end

      post.save!

    end

    # Transfer the upload keys to new user.
    keys['uploads'].each do |upload_info|

      upload = group.uploads.find(upload_info['id'])
      
      upload.keys[invitee_id] = upload_info['key']
      
      upload.save!

    end
    
    keys['distribute'].each do |distribute_info|
      
      invitation_id = distribute_info['id']
      invitation = group.invitations.find(invitation_id)
      new_key = distribute_info['key']
      
      distribute = JSON.parse(Base64
        .strict_decode64(invitation.distribute))
      
      invitee_keypairs = JSON.parse(Base64
        .strict_decode64(distribute['inviteeKeypairs']))
      
      invitee_keypairs['keys'][invitee_id] = new_key
      
      new_invitee_keypairs = Base64
        .strict_encode64(invitee_keypairs.to_json)
      
      distribute['inviteeKeypairs'] = new_invitee_keypairs
      
      new_distribute = Base64.strict_encode64(distribute.to_json)
      
      invitation.distribute = new_distribute
      
      invitation.save!
      
    end
    
    invitation.save!
    
  else
    
    error 400, 'empty_request'
    
  end
  
  track @user, 'Accepted a group invitation'
  
  empty_response
  
end

delete '/users/:user_id/groups/:group_id/invitations/:invitation_id' do |_, group_id, invitation_id|
  
  group = begin
    Group.find(group_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'group_not_found'
  end
  
  invitation = begin
    group.invitations.find(invitation_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'invitation_not_found'
  end
  
  if invitation.email != @user.email &&
     invitation.inviter.id != @user.id
    error 403, 'unauthorized'
  else
    invitation.destroy
  end
  
  selector = { action: { '$in' => [:invite_request, :invite_accept] } }
  
  invitee = User.where(email: invitation.email).first
  
  if invitee
    
    notifications = invitee.notifications.where(selector)
  
    notifications.each do |notification|
      if notification.invitation['id'] == invitation_id
        notification.destroy 
      end
    end
    
    invitee.save!
    
  end
  
  inviter = invitation.inviter
  
  notifications = inviter.notifications.where(selector)
  
  notifications.each do |notification|
    if notification.invitation['id'] == invitation_id
      notification.destroy 
    end
  end
  
  inviter.save!
  
  content_type :json
  
  empty_response
  
end

get '/users/:user_id/groups/:group_id/keys', auth: [] do |_, group_id|

  content_type :json

  group = @user.groups.find(group_id)

  posts = group.posts.map do |post|
    {
      id: post.id.to_s,
      key: post.key_for_user(@user),
      comments: post.comments.map do |comment|
        {
          id: comment.id.to_s,
          key: comment.key_for_user(@user)
        }
      end
    }
  end

  uploads = group.uploads.map do |upload|
    {
      id: upload.id.to_s,
      key: upload.key_for_user(@user)
    }
  end

  distribute = group.invitations.map do |invitation|
    
    next unless invitation.distribute
    
    distribute = JSON.parse(Base64
      .strict_decode64(invitation.distribute))
    
    invitee_keypairs = JSON.parse(Base64
      .strict_decode64(distribute['inviteeKeypairs']))
    
    key_for_user = invitee_keypairs['keys'][@user.id.to_s]
    
    {
      id: invitation.id.to_s,
      key: key_for_user
    }
    
  end
  
  {
    posts: posts,
    uploads: uploads,
    distribute: distribute
  }.to_json

end

post '/users/:user_id/invitations/acknowledge' do |_|
  
  ack_distribute = params[:distribute]
  
  if ack_distribute

    ack_distribute.each do |group_id, invitations|
    
      group = @user.groups.find(group_id)

      invitations.each do |invitation_id|
        
        invitation = group.invitations.find(invitation_id)
    
        previous = invitation.ack_distribute

        previous << @user.id.to_s
    
        invitation.ack_distribute = previous
       
        invitation.save!
        
      end
      
    end
  
  else
    
    error 400, 'missing_parameters'
    
  end
  
  empty_response
  
end

post '/users/:user_id/groups/:group_id/invitations/acknowledge' do |user_id, group_id|
  
  ack_integrate = params[:integrate]
  
  group = @user.groups.find(group_id)
  
  if ack_integrate
    
    invitation = group.invitations.find(
      ack_integrate[:invitation_id])
    
    invitation.ack_integrate = true
    
    invitation.save!
    
  else
    
    error 400, 'missing_parameters'
    
  end
  
  empty_response
  
end