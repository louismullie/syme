get '/state/invite', auth: [] do

  content_type :json
  
  group = Group.where(name: params[:group]).first
  
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
      keys: invite.keys
    })
    
  end

  # split this into separate file
  membership = @user.memberships.where(group_id: group.id).first
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
