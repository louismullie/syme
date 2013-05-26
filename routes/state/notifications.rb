get '/state/notifications', auth: [] do

  content_type :json
  
  group = Group.where(name: params[:group]).first

  @user.unread_notifications.map do |notification|
    NotificationGenerator.generate(notification, @user)
  end.to_json

end