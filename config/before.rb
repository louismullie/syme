before do

  # Get the current user's infos.
  if user_id = session[:user_id]
    @user = User.find(user_id)
  end

  # Set default content type.
  content_type 'application/json'
  
end