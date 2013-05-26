get '/state/group', auth: [] do

  content_type :json

  group = Group.where(name: params[:group]).first

  membership = @user.memberships.where(group_id: group.id).first

  full_names = group.users.map { |user| user.full_name }
  
  group_token = {
    name: group.name,
    full_names: full_names,
    keylist: membership.keylist,
    keylist_salt: membership.keylist_salt
  }
  
  group_token.to_json

end
