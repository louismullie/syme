require "base64"

get '/users/:user_id/groups/:group_id/invitations/:invitee_id', auth: [] do |user_id, group_id, invitee_id|

  if user_id.to_s != @user.id.to_s
    error 403, 'unauthorized'
  end

  group = begin
    @user.groups.find(group_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'group_not_found'
  end
  
  invitee = begin
    User.find(invitee_id)
  rescue Mongoid::Errors::DocumentNotFound
     error 404, 'invitee_not_found'
   end

  invitation = begin
    group.invitations.find_by(email: invitee.email)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'invitation_not_found'
  end

  { id: invitation.id.to_s, request: invitation.distribute }.to_json

end

post '/invitations', auth: [] do

  invitation = get_model(request)
  
  if !invitation.group_id || 
     !invitation.email ||
     !invitation.request
    error 400, 'missing_params'
  end
  
  @group = @user.groups.find(invitation.group_id)
  
  # Cleanup the e-mail.
  email = invitation.email
  
  coder = HTMLEntities.new
  email = coder.encode(email)
  email = email.downcase
  
  if @user.email == email
    error 400, 'own_email'
  end
  
  if @group.users.where(email: email).any?
    error 400, 'already_joined'
  end
  
  token = SecureRandom.uuid

  invitation = @group.invitations.create!(
    inviter_id: @user.id.to_s,
    privileges: :none, token: token,
    request: invitation.request,
    email: email
  )

  invitation.save!

  track @user, 'User invited new group member'
  
  send_invite(invitation.email, token)

  { status: 'ok', token: token }.to_json

end

put '/invitations', auth: [] do
  
  params = get_model(request)
  
  error 400, 'missing_params' if !params.id
  
  invitation = begin
    Invitation.find(params.id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'invitation_not_found'
  end
  
  if params.accept && invitation.state == 1
    
    invitation.accept = params.accept
    invitation.state = 2
    invitation.save!
    
    track @user, 'User accepted invitation'
    
    request_confirm(invitation)
    
  elsif params.integrate && params.distribute &&
        params.transfer && invitation.state == 2
  
    # Transfer keys.
    keys = JSON.parse(Base64.
      strict_decode64(params.transfer))

    invitee_id = invitation.invitee_id
    group = invitation.group
    
    keys['posts'].each do |post_info|

      post = group.complete_posts.find(post_info['id'])
      post.keys[invitee_id] = post_info['key']

      post_info['comments'].each do |comment_info|

        comment = post.complete_comments.find(comment_info['id'])
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
    
    invitation = begin
      Invitation.find(params.id)
    rescue Mongoid::Errors::DocumentNotFound
      error 404, 'invitation_not_found'
    end
  
    # User enters group.
    invitation.integrate = params.integrate

    unless params.distribute == 'e30=' # fix {}
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

    track @user, 'User confirmed invitation'

  elsif params.completed
    
    invitation.state = 4
    invitation.save!
    
  else
    
    error 400, 'empty_request'
    
  end
  
  empty_response
  
end

delete '/users/:user_id/groups/:group_id/invitations/:invitation_id', auth: [] do |_, group_id, invitation_id|
  
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
  
  if !invitee.nil?
    
    notifications = invitee.notifications.where(selector)
  
    notifications.each do |notification|
      next unless notification.invitation
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
  
  # Move out to observers (?)
  if inviter.id.to_s == @user.id.to_s
    
    invitee.notify({
      action: :invite_cancel,
      create: {
        actor_ids: [  inviter.id.to_s ],
        invitation: InvitationGenerator.generate(invitation)
    }}, group) if invitee
    
    track @user, 'User canceled invitation'
    
  elsif invitee.id.to_s == @user.id.to_s
    
    inviter.notify({
      action: :invite_decline,
      create: {
        actor_ids: [  invitee.id.to_s ],
        invitation: InvitationGenerator.generate(invitation)
    }}, group) if invitee

    track @user, 'User declined invitation'
    
  end
  
  empty_response
  
end

get '/users/:user_id/groups/:group_id/keys', auth: [] do |_, group_id|

  group = @user.groups.find(group_id)

  posts = group.complete_posts.map do |post|
    {
      id: post.id.to_s,
      key: post.key_for_user(@user),
      comments: post.complete_comments.map do |comment|
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

post '/users/:user_id/invitations/acknowledge', auth: [] do |_|
  
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
  
    empty_response

  else
    
    error 400, 'missing_parameters'
    
  end
  
  
  
end

post '/users/:user_id/groups/:group_id/invitations/acknowledge' do |user_id, group_id|
  
  ack_integrate = params[:integrate]
  
  group = begin
    @user.groups.find(group_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'group_not_found'
  end
  
  if ack_integrate
    
    invitation = group.invitations.find(
      ack_integrate[:invitation_id])
    
    invitation.ack_integrate = true
    
    invitation.save!
    
    empty_response

  else
    
    error 400, 'missing_parameters'
    
  end
  
end