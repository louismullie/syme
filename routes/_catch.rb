get '/logout', auth: [] do
  session.clear
  redirect '/login'
end

get '/*' do |route|

  Fifty.compile_template_files if $env == :development

  pass if request.xhr? or route.index('.js')

  fifty :index, {}, layout: true

end