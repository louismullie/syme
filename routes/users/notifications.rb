get '/state/notifications', auth: [] do

  content_type :json
  
  @user.unread_notifications.map do |notification|
    NotificationGenerator.generate(notification, @user)
  end.to_json

end

# Notifications.
post '/notifications/:id/:action', auth: [] do |id, action|
  
  read = action == 'read' ? true : false
  
  notification = @user.notifications.find(id)
  
  notification.update_attributes(read: read)
  
  status 204
  
end

delete '/notifications/:id', auth: [] do |id|
  
  notification = @user.notifications.find(id)
  notification.destroy!
  
  status 204
  
end