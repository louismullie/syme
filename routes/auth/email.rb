post '/auth/email' do

  email = params[:email]

  content_type :json

  if User.where(email: email).first
    response = { status: 'ok', exists: true }
  else
    response = { status: 'ok', exists: false }
  end

  response.to_json

end