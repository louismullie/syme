# Root
get '/' do
  # Render the main layout.
  File.read('./.hbs/views/layout.hbs')
end

not_found do
  redirect '/'
end