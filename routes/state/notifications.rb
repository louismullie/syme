get '/state/notifications', auth: [] do
    
  @user.unread_notifications.map do |notification|
    NotificationGenerator.generate(notification, @user)
  end.to_json

end