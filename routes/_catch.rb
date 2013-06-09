get '/logout' do
  session.clear
  redirect '/login'
end

get '/*' do |route|
  
  pass if request.xhr? or route.index('.js')

  Fifty.recompile_templates do 
    hbs = './node_modules/handlebars/bin/handlebars'
    `#{hbs} .hbs/*.handlebars -f ./public/js/asocial/templates.js`
  end

  csrf = Rack::Csrf.csrf_token(env)
  
  haml(:layout) { '&nbsp' }

end