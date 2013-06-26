get '/state/notifications', auth: [] do

  content_type :json
  
  @user.unread_notifications.map do |notification|
    NotificationGenerator.generate(notification, @user)
  end.to_json

end

delete '/notifications/:id', auth: [] do |id|
  
  track @user, 'notifications.read'
  
  notification = @user.notifications.find(id)
  notification.update_attribute! :unread, false

end

put '/users/:id/notifications', auth: [] do
  
  @user.notifications.where(unread: true)
  
end