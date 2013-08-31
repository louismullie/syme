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

post '/users/:user_id/groups', auth: [] do |_|

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

  group_id = params[:group_id]
  avatar_id = params[:avatar_id]
  
  group = Group.find(group_id)
  group.avatar_id = avatar_id

  track @user, 'User changed the group avatar'

  { status: 'ok' }.to_json

end

delete '/users/:user_id/groups/:group_id', auth: [] do |user_id, group_id|

  # Find the group to delete.
  group = begin
    Group.find(group_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'group_not_found'
  end
  
  # Find the current user's group membership.
  membership = group.memberships.
    where(user_id: @user.id.to_s).first
  
  # Verify the user is authorized to delete the group.
  if !membership || !membership.is_at_least?(:admin)
    error 403, 'unauthorized'
  end
  
  # Delete all notifications related to this group.
  # Some users may not be full members yet, so we
  # need to iterate over all users (inefficient).
  User.all.each do |user|

    notifications = user.notifications
      .where(group_id: group.id.to_s)

    notifications.destroy_all

  end
  
  # Delete all invitations related to this group.
  group.invitations.each do |invitation|
    invitation.destroy
  end

  # Notify group members of group deletion.
  group.users.each do |user|
    
    # Don't notify the person deleting.
    next if user.id == @user.id
    
    actor_ids = [@user.id.to_s]
    
    user.notify({
      action: :delete_group,
      create: { actor_ids: actor_ids }
    }, group)
    
    user.save!

  end

  # Finally, destroy the group for good.
  group.destroy

  # Track the number of group deletions.
  track @user, 'User deleted group'
  
  # Return an empty response with code 200.
  empty_response

end