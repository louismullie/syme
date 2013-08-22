get '/users/:user_id/sessions/:session_id' do |_, session_id|
  
  error 401, 'not_logged_in' if !@user
  
  client_version = Gem::Version.new(params[:version])
  syme_version = Syme::Application::VERSION
  server_version = Gem::Version.new(syme_version)
  
  if client_version < server_version
    error 409, 'outdated_extension'
  end
  
  group_members = {}
  
  @user.groups.each do |group| # code dup
    group_members[group.id.to_s] = 
    group.users.map { |user| user.full_name }
  end
  
  error 403, 'unauthorized' unless @user
  
  response = {
    user_id: @user.id.to_s,
    password_key: session[:password_key],
    group_members: group_members,
    csrf: csrf_token,
    groups: @user.groups.map(&:id).map(&:to_s)
  }.to_json

end

post '/users/:user_id/sessions' do |_|

  email = params[:email]
  email = email.downcase
  session[:email] = email
  
  begin

    user = User.find_by(email: email)

  rescue Mongoid::Errors::DocumentNotFound
    
    { status: 'error', reason: 'credentials' }.to_json

  else

    verifier = user.verifier.content
    salt = user.verifier.salt
    
    username = user.email

    authenticator = SRP::Verifier.new(1024)
    p = [username, verifier, salt, params[:A]]
    
    srp = authenticator.get_challenge_and_proof(*p)
    
    session[:proof] = srp[:proof]
    
    track user, 'User started login'
    
    srp[:challenge].merge({
      csrf: csrf_token,
      session_id: session.id.to_s
    }).to_json

  end

end

put '/users/:user_id/sessions/:session_id' do |_, session_id|

  if session_id != session.id.to_s
    error 403, 'invalid_session'
  end
  
  unless session[:proof]
    error 403, 'invalid_session'
  end
  
  authenticator = SRP::Verifier.new(1024)
  
  h_amk = authenticator.verify_session(
    session[:proof], params[:M])
  
  if h_amk

    email = session[:email]

    user = User.where(email: email).first
    
    session.clear

    session[:user_id] = user.id
    
    session[:password_key] = SecureRandom.uuid
    
    track user, 'User completed login'
    
    # session[:key] = authenticator.instance_eval { @S }
    
    response = {
      status: 'ok',
      user_id: user.id,
      h_amk: h_amk,
      csrf: csrf_token
    }.to_json
    
  else
    
    response = { status: 'error', reason: 'credentials' }.to_json

  end
  
  response
  
end

delete '/users/:user_id/sessions/:session_id' do |_,session_id|
  
  # Track the event.
  track @user, 'User was logged out'
  
  # Clear the current session.
  session.clear
  
  # Return an empty JSON response.
  encrypt_response(empty_response)
  
end