# Notifications.
post '/notifications/update', auth: [] do
  
  id = params[:notification_id]
  notification = @user.notifications.find(id)
  
  notification.update_attributes(read: true)
  
  status 200
  
end