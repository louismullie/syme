# Get the current user's information.
get '/users' do

  # Get ID and e-mail as GET parameters.
  id, email = params[:id], params[:email]

  # Make sure either ID or e-mail was provided.
  unless id || email
    error 400, 'missing_params'
  end

  if User.where(id: id).any? ||
     User.where(email: email).any?
    status 302
  else
    error 404, 'user_not_found'
  end

end

# A client submits a email. If the email is
# available, we generate a salt, store it,
# and return the salt to the client for SRP.
post '/users' do

  user = get_model(request)

  logger.info user

  logger.info user
  logger.info User.where(email: user.email).any?

  # Get the e-mail from params.
  email = user.email

  # Get the full name from params.
  full_name = user.full_name

  # Make sure email and full name are present.
  if email.blank? && full_name.blank?
    error 400, 'missing_params'
  end

  # Check if the e-mail is already taken.
  if User.where(email: email).any?
    error 400, 'email_taken'
  end

  # Generate a salt for the client.
  salt = random_bytes(16).hex.to_s # FIX

  # Validate and create the user.
  user = begin
    User.create!(
      email: user.email,
      full_name: user.full_name
    )
  # Return bad request if validation fails.
  rescue Mongoid::Errors::Validations
    error 400, 'validation_failed'
  end

  user.verifier = Verifier.new(salt: salt)

  user.save!

  # Return the user ID and salt on success.
  user.to_json

end

# The client creates the password verifier
# and sends it to the server. The server
# saves the verifier in the database.
put '/users' do

  model = get_model(request)

  # Find the user with the supplied ID.
  user = begin
    User.find(model._id)
  # Return not found if the user is nonexistent.
  rescue Mongoid::Errors::DocumentNotFound
    error 400, 'user_not_found'
  end

  # Update verifier
  if model.verifier
    user.verifier.content = model.verifier['content']
    user.verifier.save!
  end

  # Update keypair.
  if model.keypair
    user.keypair = Keypair.new(
      content: model.keypair['content'],
      salt: model.keypair['salt']
    )
  end

  # Update user name.
  if model.full_name
    user.full_name = model.full_name
  end

  # Save user.
  user.save!

  # Return empty JSON.
  empty_response

end

# Delete a user permanently.
delete '/users/:user_id', auth: [] do |user_id|

  # Destroy user in DB.
  @user.destroy!

  # Return empty JSON.
  empty_response

end

get '/users/:user_id/qr_code' do |user_id|
  ga = GoogleAuthenticator.new
  session['ga_secret_key'] = ga.secret_key
  ga.qrcode_image_url(params[:email])
end