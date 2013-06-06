get '/logout' do
  session.clear
  redirect '/login'
end

get '/*' do |route|

  pass if request.xhr? or route.index('.js')

  Fifty.compile_template_files if $env == :development

  fifty :index, {}, layout: true

end