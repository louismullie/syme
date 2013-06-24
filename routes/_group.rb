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

  
  {
    groups: groups,
    invites: invites
  }.to_json

end