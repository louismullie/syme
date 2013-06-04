post '/groups/create', auth: [] do

  name, screen_name = params[:name], params[:name].slug

  membership = Membership.create(
    keylist: params[:keylist],
    keylist_salt: params[:keylist_salt]
  )

  group = Group.create(name: name, screen_name: screen_name)

  group.memberships << membership
  group.users << @user
  
  @user.groups << @group
  @user.memberships << membership

  membership.save!
  @user.save!
  group.save!
  
  track @user, 'Created a new group'
  
  content_type :json

  { name: name, screen_name: screen_name }.to_json

end

# Set group avatar.
post '/:group/avatar', auth: [] do

  group, avatar_id = params[:group], params[:avatar_id]
  @group = Group.where(name: group).first

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