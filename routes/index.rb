get '/' do
  if File.readable?('./.hbs/views/layout.hbs')
    File.read('./.hbs/views/layout.hbs')
  else
    'Nothing to see here.'
  end
end

not_found do
  redirect '/'
end