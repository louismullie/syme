# Helper route for development; serves the web
# application inside a browser window.
if settings.environment == :development
  
  get '/' do
    
    # Set the content type for page.
    content_type 'text/html'
    
    # Verify that the layout exists.
    if File.readable?(settings.layout_path)
      File.read(settings.layout_path)  
    else
      'Layouts have not been generated.'
    end
  
  end
  
else
  
  get('/') { status 403 }
  
end