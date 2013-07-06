get '/users/:user_id/notifications', auth: [] do

  content_type :json

  @user.notifications.map do |notification|
    NotificationGenerator.generate(notification, @user)
  end.to_json

end

patch '/users/:user_id/notifications/:notification_id',
  auth: [] do |_, notification_id|

  model = get_model(request)

  return empty_response unless model

  notification = @user.notifications.find(notification_id)

  notification.update_attributes(read: model.read) if model.read

  status 204

end

patch '/users/:user_id/notifications', auth: [] do |_|

  model = get_model(request)

  if model.read
    @user.notifications.update_all(:read, true)
    @user.save!
  end

  status 204

end