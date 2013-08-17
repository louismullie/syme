get '/users/:user_id/groups', auth: [] do |_|

  encrypted = params.dup
  params = decrypt_params(encrypted)

  groups = @user.groups
    .where(ack_create: true)
    .desc(:updated_at).map do |group|
    GroupGenerator.generate(group, @user)
  end

  user_invites = Invitation.where(
    email: @user.email, state: { '$in' => [1, 2]})

  invites = user_invites.empty? ? false :

    user_invites.map do |invite|
      InvitationGenerator.generate(invite)
    end

  response = {
    groups: groups,
    invites: invites
  }.to_json

  encrypt_response(response)

end

get '/users/:user_id/groups/:group_id', auth: [] do |_, group_id|

  encrypted = params.dup
  params = decrypt_params(encrypted)

  group = begin
    @user.groups.find(group_id)
  rescue
    error 404, 'group_not_found'
  end

  posts = group.complete_posts.page(1)

  response = FeedGenerator.generate(posts, @user, group).to_json

  encrypt_response(response)

end

post '/groups', auth: [] do

  encrypted = params.dup
  params = decrypt_params(encrypted)

  name, screen_name = params[:name], params[:name].slug

  membership = Membership.create(privilege: :admin)

  group = Group.create(
    name: name,
    screen_name: screen_name
  )

  group.memberships << membership
  group.users << @user
  group.touch

  @user.groups << @group
  @user.memberships << membership

  membership.save!
  @user.save!
  group.save!

  track @user, 'User created new group'

  response = { id: group.id.to_s }.to_json

  encrypt_response(response)

end

put '/users/:user_id/groups/:group_id', auth: [] do |_, group_id|

  encrypted = params.dup
  params = decrypt_params(encrypted)

  group = @user.groups.find(group_id)

  if params[:ack_create]
    group.ack_create = true
    group.save!
  end

  track @user, 'User acknowledged group creation'

  encrypt_response(empty_response)

end

# Set group avatar.
post '/:group_id/avatar', auth: [] do

  group_id, avatar_id = params[:group_id], params[:avatar_id]
  @group = Group.find(group_id)

  @group.avatar_id = avatar_id

  track @user, 'User changed the group avatar'

  { status: 'ok' }.to_json

end

delete '/groups/:id', auth: [] do |id|

  group = Group.find(id)

  User.all.each do |user|

    notifications = user.notifications
      .where(group_id: group.id.to_s)

    notifications.destroy_all

  end

  group.invitations.each do |invitation|
    invitation.destroy
  end

  group.destroy

  track @user, 'User deleted group'

  { status: 'ok' }.to_json

end