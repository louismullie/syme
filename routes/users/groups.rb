get '/users/:id/groups', auth: [] do

  groups = @user.groups.desc(:updated_at).map do |group|
    GroupGenerator.generate(group, @user)
  end
  
  shift, left_column, right_column = true, [], []
  
  # Reorder posts for a two-column layout
  groups.each do |group|
    right_column << group if shift
    left_column << group if !shift
    shift = shift ? false : true
  end
  
  groups = left_column + right_column

  user_invites = Invitation.where(
    email: @user.email, state: { '$in' => [1, 2]})

  invites = user_invites.empty? ? false :

    user_invites.map do |invite|
      InvitationGenerator.generate(invite)
    end

  content_type :json
  
  {
    groups: groups,
    invites: invites
  }.to_json

end

get '/state/group', auth: [] do

  content_type :json

  group_id = params[:group_id]
  
  group = @user.groups.find(group_id)

  membership = @user.memberships.where(group_id: group.id).first

  full_names = group.users.map { |user| user.full_name }
  
  group_token = {
    id: group.id.to_s,
    name: group.name,
    full_names: full_names,
    keylist: membership.keylist,
    keylist_salt: membership.keylist_salt,
    answer: membership.answer,
    answer_salt: membership.answer_salt
  }
  
  group_token.to_json

end

post '/groups', auth: [] do

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

  track @user, 'User created a new group'

  content_type :json

  { id: group.id.to_s }.to_json

end

put '/users/:user_id/groups/:group_id', auth: [] do |_, group_id|
  
  group = @user.groups.find(group_id)
  logger.info params
  
  if params[:ack_create]
    group.ack_create = true
    group.save!
  end
  
  track @user, 'User acknowledged group creation'

  empty_response
  
end

# Set group avatar.
post '/:group_id/avatar', auth: [] do

  group_id, avatar_id = params[:group_id], params[:avatar_id]
  @group = Group.find(group_id)

  @group.avatar_id = avatar_id

  track @user, 'User changed the group avatar'

  content_type :json
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