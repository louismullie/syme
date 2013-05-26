get '/state/user', auth: [] do

  content_type :json

  unless @user
    raise 'Cannot get state of undefined user.'
  end
  
  { id: @user.id, keypair: @user.keypair,
    keypair_salt: @user.keypair_salt,
    password_key: @user.session_id
  }.to_json

end