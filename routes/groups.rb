get '/users/:id/groups', auth: [] do

  groups = @user.groups.map do |group|
    GroupGenerator.generate(group, @user)
  end

  user_invites = Invite.where(
    email: @user.email, state: { '$in' => [1, 2]})

  invites = user_invites.empty? ? false :

    user_invites.map do |invite|
      InviteGenerator.generate(invite)
    end

  content_type :json

  {
    groups: groups,
    invites: invites
  }.to_json

end

post '/groups', auth: [] do

  name, screen_name = params[:name], params[:name].slug
  answer_salt = params[:answer_salt]
  question, answer = params[:question], params[:answer]
  
  membership = Membership.create(
    privilege: :admin,
    keylist: params[:keylist],
    keylist_salt: params[:keylist_salt],
    answer: answer,
    answer_salt: answer_salt
  )

  group = Group.create(
    name: name,
    screen_name: screen_name,
    question: question
  )

  group.memberships << membership
  group.users << @user

  @user.groups << @group
  @user.memberships << membership

  membership.save!
  @user.save!
  group.save!

  track @user, 'Created a new group'

  content_type :json

  { id: group.id.to_s,
    name: name,
    screen_name: screen_name
  }.to_json

end

# Set group avatar.
post '/:group_id/avatar', auth: [] do

  group_id, avatar_id = params[:group_id], params[:avatar_id]
  @group = Group.find(group_id)

  @group.avatar_id = avatar_id

  track @user, 'Added a group avatar'

  content_type :json
  { status: 'ok' }.to_json

end

delete '/groups/:id', auth: [] do |id|

  group = Group.find(id)
  group.destroy

  track @user, 'Deleted a group'

  { status: 'ok' }.to_json

end