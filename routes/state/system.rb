get '/state/system' do

  content_type :json

  data = {
    install: User.all.empty?,
    logged_in: !@user.nil?,
    user_id: @user.nil? ? '' : @user.id
  }
  
  data.to_json

end