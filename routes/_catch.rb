get '/:group' do |group|
  @group = Group.where(name: group).first
  pass
end

get '/logout', auth: [] do
  session.clear
  redirect '/'
end

get '/*' do |route|

  if $env == :development
    Fifty.compile_template_files
  end
  
  pass if request.xhr? or route.index('.js')

  fifty :index, {}, layout: true

end