# Root
get '/' do
  # Render the main layout.
  File.read('./.hbs/views/layout.hbs')
end

# Catch-all route.
get '/*' do |route|

  # Pass for all AJAX requests.
  pass if request.xhr?

  # Otherwise redirect to root
  redirect '/'

end

# Catch-all for every non-GET 404
not_found do
  redirect '/'
end