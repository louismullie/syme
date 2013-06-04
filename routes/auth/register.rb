## Step 1. A client submits a email.
# If the email is available, we
# generate a salt, store it, and return it.
post '/register/1' do

  email = params[:email]
  full_name = params[:full_name]

  content_type :json

  if User.where(email: email).empty?

    salt = !params[:salt].nil? ?
    params[:salt] : random_bytes(16).hex

    user = User.create(
      email: email,
      full_name: full_name,
      verifier_salt: salt.to_s
    )

    user.save!

    track user, 'User started registration'

    { salt: salt.to_s,
      user_id: user.id.to_s
    }.to_json

  else

    { error: 'email_taken' }.to_json

  end

end

# Step 2. The client creates the password
# verifier and sends it to the server,
# along with the email.
post '/register/2' do

  user = User.find(params[:user_id])

  user.verifier = params[:v]

  track user, 'User completed registration'

  user.save!

  { status: 'ok' }.to_json

end

# Step 3. The client logs in and
# generates the keys.
post '/register/3', auth: [] do

  user = User.find(params[:user_id])

  user.keypair = params[:keypair]
  user.keypair_salt = params[:keypair_salt]

  track user, 'User generated keys'

  user.save!

  # broadcast :create, :user

  content_type :json

  { status: 'ok' }.to_json

end