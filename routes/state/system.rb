get '/state/system' do

  content_type :json

  data = {
    logged_in: !@user.nil?
  }

  data.to_json

end