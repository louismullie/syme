# Catch-all route.
get '/*' do |route|
  
  # Pass for all AJAX requests.
  pass if request.xhr?
  
  # Otherwise render the main layout.
  File.read('./.hbs/views/layout.hbs')

end