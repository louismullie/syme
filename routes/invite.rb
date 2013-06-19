require "base64"

post '/:group_id/invite/send', auth: [] do |group_id|

  content_type :json

  @group = @user.groups.find(group_id)

  return { status: 'own_email' }.to_json if
    params['email'] == @user.email

  # Generate invitation token.
  token = SecureRandom.uuid

  # Store P and P_sB.
  invite = @group.invites.create!(
    inviter_id: @user.id.to_s,
    email: params['email'],
    privileges: :none,
    token: token,
    P: params['P'],
    p_sB: params['p_sB'],
    sB_salt: params['sB_salt']
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

  # Invite
  invitee = User.find(user_id)
  invite.invitee_id = invitee.id.to_s

  invite.k_P = params['k_P']
  invite.k_sA = params['k_sA']
  invite.PA_k = params['PA_k']
  invite.a_P = params['a_P']

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

  membership.keylist = params[:keylist]
  membership.keylist_salt = params[:keylist_salt]
  membership.save!

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