delete '/notifications/:id', auth: [] do |id|
  
  track @user, 'Cleared notification'
  
  @user.notifications.find(id).destroy
  
  { status: 'ok' }.to_json

end