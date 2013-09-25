# Helper route for development; serves the web
# application inside a browser window.
if settings.environment == :development
  
  get '/' do
    
    # Set the content type for page.
    content_type 'text/html'
      
    # Generate the layout path.
    layout_path = File.join(
      settings.hbs_path, 'layout.hbs')
    
    # Verify that the layout exists.
    if File.readable?(layout_path)
      File.read(layout_path)  
    else
      'Layouts have not been generated.'
    end
  
  end
  
else
  
  get('/') { status 503 }
  
end