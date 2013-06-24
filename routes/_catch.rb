get '/logout' do
  session.clear
  redirect '/login'
end

get '/*' do |route|

  # If the request comes from XHR, pass to the actual route
  # which will render JSON content

  pass if request.xhr? or route.index('.js')

  csrf = Rack::Csrf.csrf_token(env)

  File.read('./.hbs/views/layout.hbs')

end