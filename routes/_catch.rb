get '/logout' do
  session.clear
  redirect '/login'
end

get '/*' do |route|

  pass if request.xhr? or route.index('.js')

  Fifty.recompile_templates do 
    `./node_modules/handlebars/bin/handlebars .hbs/*.handlebars -f ./public/js/asocial/templates.js`
  end

  fifty :index, {}, layout: true

end