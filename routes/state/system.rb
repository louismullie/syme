get '/state/system' do

  
  data = {
    install: User.all.empty?,
    logged_in: !@user.nil?
  }
  
  data.to_json

end