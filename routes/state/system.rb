get '/state/system' do

  content_type :json

  data = {
    install: User.all.empty?,
    logged_in: !@user.nil?
  }
  
  data.to_json

end