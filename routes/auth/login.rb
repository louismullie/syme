# Step 1: The user sends an identifier and public ephemeral key, A
# The server responds with the salt and public ephemeral key, B
post '/login/1' do

  content_type :json

  n, g, k = srp_params

  email = params[:email]
  session[:email] = email
  
  begin

    user = User.find_by(email: email)

  rescue Mongoid::Errors::DocumentNotFound
    
    { status: 'error', reason: 'credentials' }.to_json

  else

    v, salt = user.verifier.content, user.verifier.salt

    b = random_bytes(32).hex

    session[:b] = b
    session[:v] = v

    # B = g^b + k v (mod N)
    bb = (mod_pow(g, b, n) + k * v.to_i) % n

    session[:A] = params[:A].to_i
    session[:B] = bb

    track user, 'User started login'
    
    { status: 'ok', salt: salt, 'B' => bb.to_s }.to_json

  end

end

# Step 2: The client sends its proof of S.
# The server confirms, and sends its proof of S.
post '/login/2' do

  content_type :json

  n, g, k = srp_params

  unless session[:A] && session[:B] &&
    session[:b] && session[:v]
    return {
      status: 'error',
      reason: 'server'
    }.to_json
  end

  aa, bb = session[:A], session[:B]

  b, v = session[:b], session[:v].to_i

  u = calc_u(aa, bb, n)

  y = mod_pow(v, u, n) * aa

  sss = mod_pow(y % n, b, n)

  if params[:ssc] == sss.to_s

    email = session[:email]

    user = User.where(email: email).first

    session.clear
    session[:user_id] = user.id

    user.session_id = bb
    user.save!

    data = { user_id: user.id, status: 'ok' }

    track user, 'User completed login'
    
    data.to_json

  else
    
    { status: 'error', reason: 'credentials' }.to_json

  end

end
