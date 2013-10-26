# Get the current user's information.
get '/users/?:user_id?' do |user_id|
  
  # Get ID and e-mail from GET parameters.
  id = user_id || params[:id]
  email = params[:email]

  # Make sure either ID or e-mail was provided.
  if id.blank? && email.blank?
    error 400, 'missing_params'
  end
  
  # Make sure user is authorized to view resource.
  if @user.id.to_s != id
    error 403, 'unauthorized'
  end
  
  # Sanitize the e-mail if present.
  email = email.downcase if email
  
  # Make sure user exists by ID or e-mail.
  unless (User.where(id: id).any? ||
         User.where(email: email).any?)
   error 404, 'user_not_found'
  end
  
  # Make sure user is logged in and
  # authorized for the requested user.
  if !@user || (id != @user.id.to_s)
    error 403, 'unauthorized'
  end

  # Return the user document as JSON.
  response = UserGenerator.generate(@user, @user).to_json
  
end

# A client submits a email and a name. If the email is
# available, reserve it by creating a new user.
post '/users' do

  # Get Backbone JSON as struct.
  user = get_model(request)

  # Get the e-mail from params.
  email = user.email

  # Get the full name from params.
  full_name = user.full_name
  email = user.email
  
  # Make sure email and full name are present.
  if email.blank? && full_name.blank?
    error 400, 'missing_params'
  end

  # Check if the e-mail is already taken.
  if User.where(email: email).any?
    error 400, 'email_taken'
  end

  # Validate and create the user.
  token = SecureRandom.uuid
  warn token
  
  user = begin
    User.create!(
      email: email,
      full_name: full_name,
      confirmation_token: token
    )
  # Return bad request if validation fails.
  rescue Mongoid::Errors::Validations
    error 400, 'validation_failed'
  end

  # Save the user in the database.
  user.save!
  
  # Save the user in the session.
  session[:user_id] = user.id.to_s
  
  # Merge the CSRF token to the user hash.
  user_hash = UserGenerator.generate(user, user)
    .merge({ csrf: csrf_token, access_token: user.access_token })
  
  # Convert the hash back to JSON.
  response = user_hash.to_json
  
end

# The client creates the salt and verifier (s, v)
# and sends them to the server, which stores them.
put '/users', auth: [] do
  
  # Get Backbone JSON as struct.
  model = get_model(request)
  
  # Authorize the user to edit.
  if model.id != @user.id.to_s
    error 403, 'unauthorized'
  end
  
  # Find the user with the supplied ID.
  user = begin
    User.find(model.id)
  # Return 404 if the user cannot be found.
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'user_not_found'
  end

  # Update the verifier and salt.
  if model.verifier

    # Build the verifier with the salt.
    user.verifier = Verifier.new(
      salt:     model.verifier.salt,
      content:  model.verifier.content,
      version:  1
    )

    EventAnalysis.track user, 'User completed registration'

    user.verifier.save!
    
    unless user.emails_sent[:confirm_email]
      send_confirm_email(user)
    end
    
  end

  # Update the keypair.
  if model.keyfile
    user.keyfile = model.keyfile
  end

  # Update the user name.
  if model.full_name
    
    user.full_name = model.full_name
    
  end
  
  # Update the user email.
  if model.email
    
    email = model.email.downcase
    
    # Find existing user with e-mail.
    existing_user = User.where(
      email: email).first
    
    # Announce if e-mail is taken.
    if existing_user && @user &&
       existing_user.id != @user.id
      error 400, 'email_taken'
    else
    # Set the e-mail if available.
      user.email = email
    end
    
  end

  # Save user to database.
  user.save!
  
  # Return empty JSON.
  empty_response

end

# Delete a user permanently.
delete '/users/:user_id', auth: [] do |user_id|

  encrypted = params.dup
  params = decrypt_params(encrypted)
  
  # Verify user is authorized to delete.
  if user_id != @user.id.to_s
    error 403, 'unauthorized'
  end
  
   EventAnalysis.track @user, 'User deleted account'

  # Destroy all of the user's groups.
  @user.groups.each do |group|
    group.destroy
  end
  
  # Destroy the user.
  @user.destroy

  # Clear the session.
  session.clear
  
  # Return empty JSON.
  encrypt_response(empty_response)

end

get '/users/:user_id/confirm' do |user_id|
  
  token, user = params[:token], nil

  begin
    user = User.find(user_id)
    raise unless user.confirmation_token == token
  rescue
    error 403, 'unauthorized'
  else
    user.confirmed = true
    user.save!
  end

  redirect 'chrome-extension://kebgjahkgfpaeidbimpiefobehkjmani/syme.html'

  
end