require "base64"

get '/users/:user_id/groups/:group_id/invitations', auth: [] do |_, group_id|

  group = @user.groups.find(group_id)
  
  invitations = {}
  
  group.invitations.each do |invitation|
    
    # Current user is the invitee
    if invitation.state == 3 &&
       invitation.invitee_id == @user.id.to_s &&
       !invitation.ack_integrate
    
      invitations[:integrate] = {
        id: invitation.id.to_s,
        request: invitation.integrate
      }
      
    # Invite has been accepted
    elsif invitation.state > 2  &&
      
      # Current user is not inviter
      invitation.inviter_id != @user.id.to_s &&  
      # Current user is not invitee
      invitation.invitee_id != @user.id.to_s && 
      # Key distribution is needed, i.e. > 2 users
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
    params['email'] == @user.email

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
    error 400, 'invalid_id'
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
    
    invitation.save!
    
  else
    
    error 400, 'empty_request'
    
  end
  
  track @user, 'Accepted a group invitation'
  
  empty_response
  
end

get '/users/:user_id/groups/:group_id/keys', auth: [] do |_, group_id|

  content_type :json

  group = @user.groups.find(group_id)

  posts = group.posts.map do |post|
    {
      id: post.id.to_s,
      key: post.key_for_user(@user),
      sender_id: post.owner.id.to_s,
      comments: post.comments.map do |comment|
        {
          id: comment.id.to_s,
          key: comment.key_for_user(@user),
          sender_id: comment.owner.id.to_s
        }
      end
    }
  end

  uploads = group.uploads.map do |upload|
    {
      id: upload.id.to_s,
      key: upload.key_for_user(@user),
      sender_id: upload.owner.id.to_s
    }
  end

  { posts: posts, uploads: uploads }.to_json

end

post '/users/:user_id/groups/:group_id/invitations/acknowledge' do |user_id, group_id|
  
  ack_integrate = params[:integrate]
  ack_distribute = params[:distribute]
  
  group = @user.groups.find(group_id)
  
  if ack_distribute

    ack_distribute.each do |invitation_id|
    
      invitation = group.invitations.find(invitation_id)
    
      previous = invitation.ack_distribute

      previous << @user.id.to_s
    
      invitation.ack_distribute = previous
       
      invitation.save!
       
    end
   
    
  elsif ack_integrate
    
    invitation = group.invitations.find(
      ack_integrate[:invitation_id])
    
    invitation.ack_integrate = true
    
    invitation.save!
    
  else
    
    error 400, 'missing_parameters'
    
  end
  
  empty_response
  
end

=begin
post '/:group_id/invite/send', auth: [] do |group_id|

  content_type :json

  @group = @user.groups.find(group_id)

  return { status: 'own_email' }.to_json if
    params['email'] == @user.email

  # Generate invitation token.
  token = SecureRandom.uuid

  invite = @group.invites.create!(
    inviter_id: @user.id.to_s, privileges: :none,
    email: params['email'], token: token,
    inviter_pub_key: params['inviter_pub_key'],
    enc_inviter_priv_key: params['enc_inviter_priv_key'],
    inviter_priv_key_salt: params['inviter_priv_key_salt']
  )

  invite.save!

  track @user, 'Invited a new group member'
  send_invite(invite.email, token)

  { status: 'ok', token: token }.to_json

end

get '/:group_id/invite/keys', auth: [] do |group_id|

  @group = Invite.find(params[:invite_id]).group

  content_type :json

  posts = @group.posts.map do |post|
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

  uploads = @group.uploads.map do |upload|
    {
      id: upload.id.to_s,
      key: upload.key_for_user(@user)
    }
  end

  { status: 'ok', keys: {
      posts: posts, uploads: uploads
  }}.to_json

end

# Step 2. User accepts invite.
post '/invite/accept' do

  token, user_id = params[:token], params[:user_id]

  invite = Invite.where(token: token).first
  @group = invite.group

  invitee = User.find(user_id)
  invite.invitee_id = invitee.id.to_s

  invite.invitee_pub_key = params['invitee_pub_key']
  invite.enc_invitee_priv_key = params['enc_invitee_priv_key']
  invite.invitee_priv_key_salt = params['invitee_priv_key_salt']

  invite.PA_k = params['PA_k']
  invite.a_k = params['a_k']
  invite.k_sA = params['k_sA']

  invite.save!

  invite.state = 2
  invite.save!

  # Send e-mail requesting confirmation.
  request_confirm(invite)

  track @user, 'Accepted a group invitation'

  # Inviter
  inviter = @group.users.find(invite.inviter_id)

  content_type :json

  { status: 'ok' }.to_json

end

post '/invite/confirm', auth: [] do

  @group = Group.find(params[:group_id])

  @group.touch

  invite = @group.invites.find(params[:invite_id])
  invitee_id = invite.invitee.id.to_s

  # invite.keys = params[:keys]

  # Parse the JSON-formatted, Base64-encoded version of keys.
  keys = JSON.parse(Base64.strict_decode64(params[:keys]))

  # Transfer the post and comment keys.
  keys['posts'].each do |post_info|

    post = @group.posts.find(post_info['id'])
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

    upload = @group.uploads.find(upload_info['id'])
    upload.keys[invitee_id] = upload_info['key']
    upload.save!

  end

  invite.PPA_k = params[:PPA_k]
  invite.a_PA = params[:a_PA]

  invite.state = 3
  invite.save!

  invitee = invite.invitee
  inviter = invite.inviter

  notify_confirmed(invite)

  membership = Membership.create

  @group.memberships << membership
  @group.users << invitee
  @group.save!

  invitee.memberships << membership

  # membership.keylist = params[:keylist]
  # membership.keylist_salt = params[:keylist_salt]
  # membership.save!

  invitee.save!

  track @user, 'Confirmed a new group member'

  content_type :json

  { status: 'ok' }.to_json

end

post '/invite/integrate', auth: [] do

  @group = Group.find(params[:group_id])

  membership = @user.memberships.where(group_id: @group.id).first

  membership.keylist = params[:keylist]
  membership.keylist_salt = params[:keylist_salt]

  membership.answer = params[:answer]
  membership.answer_salt = params[:answer_salt]

  membership.save!

  @user.save!

  track @user, 'Succesfully integrated new group'

  content_type :json

  { status: 'ok' }.to_json

end

post '/invite/update', auth: [] do

  @group = Group.find(params[:group_id])

  m = @group.memberships.where(user_id: @user.id).first
  m.keylist = params[:keylist]
  m.keylist_salt = params[:keylist_salt]
  m.save!

  content_type :json

  { status: 'ok' }.to_json

end

post '/invite/broadcast', auth: [] do

  @group = Group.find(params[:group_id])

  invitee_id = params[:invitee_id]
  invitee_key = params[:public_key]

  @group.memberships.each do |membership|

    next if membership.user.id.to_s == invitee_id
    membership.new_keys[invitee_id] = invitee_key
    membership.save!

  end

  content_type :json

  { status: 'ok' }.to_json

end

post '/invite/acknowledge', auth: [] do

  @group = Group.find(params[:group_id])

  if params[:type] == 'update'

    membership = @group.memberships.where(user_id: @user.id).first
    new_keys = membership.new_keys

    params[:new_keys].each do |id|
      new_keys.delete(id)
    end

    membership.new_keys = new_keys

    membership.save!

  elsif params[:type] == 'integrate'

    invite = @group.invites
      .find(params[:invite_id])
    invite.destroy
  else

    raise

  end

  content_type :json

  { status: 'ok' }.to_json

end

get '/state/invite', auth: [] do

  content_type :json
  
  group = Group.find(params[:group_id])
  
  invite = group.invites.where({
    invitee_id: @user.id.to_s, state: 3
  }).first
  
  state = {}
  
  integrate = !invite.nil?

  if integrate

    state.merge!({
      PPA_k: invite.PPA_k,
      k_sA: invite.k_sA,
      id: invite.id.to_s,
      a_PA: invite.a_PA,
      keys: invite.keys
    })
    
  end

  membership = @user.memberships.where(
    group_id: group.id).first
  
  update = membership.new_keys.size > 0
  
  if update
    state.merge!({
      new_keys: Base64.strict_encode64(membership.new_keys.to_json)
    })
  end
  
  state.merge!({
    update: update,
    integrate: integrate
  })
  
  state.to_json

end
=end