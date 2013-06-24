before do

  # Get the current user's infos.
  # Move this to auth so it only
  # gets executed if necessary.
  if user_id = session[:user_id]
    @user = User.find(user_id)
  end
  
  # Default to JSON content type.
  content_type 'application/json'
   
end