get '/logout' do
  session.clear
  redirect '/login'
end

get '/*' do |route|

  # If the request comes from XHR, pass to the actual route
  # which will render JSON content

  pass if request.xhr? or route.index('.js')

  # Otherwise, compile generic template which will be filled
  # dynamically

  Fifty.recompile_templates do
    hbs = './node_modules/handlebars/bin/handlebars'
    `#{hbs} .hbs/*.handlebars -f ./public/js/asocial/templates.js`
  end

  csrf = Rack::Csrf.csrf_token(env)

  haml(:layout) { '&nbsp' }

end