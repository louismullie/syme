get '/state/group', auth: [] do

  content_type :json

  group_id = params[:group_id]
  
  group = @user.groups.find(group_id)

  membership = @user.memberships.where(group_id: group.id).first

  full_names = group.users.map { |user| user.full_name }
  
  group_token = {
    name: group.name,
    full_names: full_names,
    keylist: membership.keylist,
    keylist_salt: membership.keylist_salt,
    answer: group.answer,
    salt: group.salt
  }
  
  group_token.to_json

end