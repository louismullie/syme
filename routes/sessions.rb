get '/state/session' do
  
  if params[:version] && Gem::Version.new(params[:version]) <
      Gem::Version.new(Syme::Application::VERSION)
    error 409, 'outdated_extension'
  end
  
  error 401, 'not_logged_in' if !@user
  
  group_members = {}
  
  @user.groups.each do |group| # code dup
    group_members[group.id.to_s] = 
    group.users.map { |user| user.full_name }
  end
  
  content_type :json
  
  error 403, 'unauthorized' unless @user
  
  { user_id: @user.id.to_s,
    password_key: session[:password_key],
    group_members: group_members,
    csrf: csrf_token,
    groups: @user.groups.map(&:id).map(&:to_s)
  }.to_json

end


# Step 1: The user sends an identifier and public ephemeral key, A
# The server responds with the salt and public ephemeral key, B
post '/login/1' do

  content_type :json

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
    
    track user, 'login.start'
    
    srp[:challenge].merge({ csrf: csrf_token }).to_json

  end

end

# Step 2: The client sends its proof of S.
# The server confirms, and sends its proof of S.
post '/login/2' do

  content_type :json

  authenticator = SRP::Verifier.new(1024)

  unless session[:proof]
    error 403, 'invalid_session'
  end

  h_amk = authenticator.verify_session(
    session[:proof], params[:M])
  
  if h_amk

    email = session[:email]

    user = User.where(email: email).first

    user.session_id = session[:proof][:B]
    user.save!
    
    session.clear

    session[:user_id] = user.id
    
    session[:password_key] = SecureRandom.uuid
    
    track user, 'User completed login'
    
    {
      status: 'ok',
      user_id: user.id,
      h_amk: h_amk,
      csrf: csrf_token
    }.to_json
    
  else
    
    { status: 'error', reason: 'credentials' }.to_json

  end

end

# Clear session.
delete '/sessions/:session_id' do |session_id|
  
  # Clear the current session.
  session.clear
  
  # Return an empty JSON response.
  empty_response
  
end
