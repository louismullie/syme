# Step 1: The user sends an identifier and public ephemeral key, A
# The server responds with the salt and public ephemeral key, B
post '/login/1' do

  content_type :json

  email = params[:email]
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
    
    srp[:challenge].to_json

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

    data = {
      status: 'ok',
      user_id: user.id,
      h_amk: h_amk,
      csrf: csrf_token
    }

    track user, 'User completed login'
    
    data.to_json

  else
    
    { status: 'error', reason: 'credentials' }.to_json

  end

end
