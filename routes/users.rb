# Get the current user's information.
get '/users' do
  
  # Get ID and e-mail as GET parameters.
  id, email = params[:id], params[:email]

  # Make sure either ID or e-mail was provided.
  if id.blank? && email.blank?
    error 400, 'missing_params'
  end

  unless (User.where(id: id).any? ||
         User.where(email: email).any?)
   error 404, 'user_not_found'
  end
  
  if !@user || (id != @user.id.to_s)
    error 403, 'unauthorized'
  end

  @user.to_json
  
end

get '/state/session', auth: [] do
  
  content_type :json

  error 403, 'unauthorized' unless @user
  
  { user_id: @user.id.to_s,
    password_key: @user.session_id
  }.to_json

end

# A client submits a email. If the email is
# available, we generate a salt, store it,
# and return the salt to the client for SRP.
post '/users' do

  user = get_model(request)

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

  # Validate and create the user.
  user = begin
    User.create!(
      email: user.email,
      full_name: user.full_name,
    )
  # Return bad request if validation fails.
  rescue Mongoid::Errors::Validations
    error 400, 'validation_failed'
  end

  user.save!

  # Return the user ID and salt on success.
  user.to_json

end

# The client creates the password verifier
# and sends it to the server. The server
# saves the verifier in the database.
put '/users' do

  model = get_model(request)

  logger.info model
  
  # Find the user with the supplied ID.
  user = begin
    User.find(model._id)
  # Return not found if the user is nonexistent.
  rescue Mongoid::Errors::DocumentNotFound
    error 400, 'user_not_found'
  end

  # Update verifier
  if model.verifier

    # Build the verifier with the salt.
    user.verifier = Verifier.new(
      salt:  model.verifier['salt'],
      content:  model.verifier['content']
    )

    user.verifier.save!

  end

  # Update keypair.
  if model.keyfile
    user.keyfile = model.keyfile
    user.save!
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

get '/users/:user_id', auth: [] do |user_id|

  user = User.find(user_id) if @user.id.to_s == user_id

  content_type :json
  user.to_json

end

# Delete a user permanently.
delete '/users/:user_id', auth: [] do |user_id|

  # Destroy user in DB.
  @user.destroy!

  # Return empty JSON.
  empty_response

end