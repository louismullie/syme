get '/users/:user_id/notifications', auth: [] do |user_id|

  # Verify user is authorized to view notifications.
  if user_id != @user.id.to_s
    error 403, 'unauthorized'
  end
  
  # Grab the current user's notifications.
  notifications = @user.notifications.where(read: false)
  
  # Generate and return notifications in JSON format.
  NotificationGenerator.generate_notifications(
    notifications, @user).to_json

end

patch '/users/:user_id/notifications/:notification_id',
  auth: [] do |user_id, notification_id|

  # Verify user is authorized to modify notifications.
  if user_id != @user.id.to_s
    error 403, 'unauthorized'
  end
  
  # Get the Backbone model as JSON.
  model = get_model(request)

  # Return 400 if params are missing.
  error 400, 'missing_params' if !model
  
  # Get the notification by ID.
  notification = begin
    @user.notifications.find(notification_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'not_found'
  end

  # Update the notification's read status.
  if model.read
    notification.read = model.read
  end
  
  # Save the notification to the database.
  notification.save!

  # Return no response.
  status 204

end

# Fix - take from params and move to patch.
delete '/users/:user_id/notifications', auth: [] do |user_id|
  
  # Verify user is authorized to clear notifications.
  if user_id != @user.id.to_s
    error 403, 'unauthorized' 
  end
  
  # Prevent invite request and confirm from clearing.
  permanent = [:invite_request, :invite_accept]
  
  # Mark all the user's notifications as read.
  @user.notifications.each do |notification|
    next if permanent.include?(notification.action)
    notification.update_attributes(read: true)
  end
  
  # Save the user to the database.
  @user.save!
  
  # Return an empty response.
  encrypt_response(empty_response)

end