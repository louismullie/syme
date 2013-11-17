# Helper route for development; serves the web
# application inside a browser window.
if settings.environment == :development

  get '/' do

    # Set the content type for page.
    content_type 'text/html'

    # Verify that the layout exists.
    if File.readable?(settings.layout_path)
      layout = File.read(settings.layout_path)
      Haml::Engine.new(layout).render
    else
      'The layout file cannot be found.'
    end

  end

else

  get('/') { status 403 }

end

get '/mobile' do

  protected!
  
  content_type 'text/html'

  layout = File.read(settings.layout_path)
  Haml::Engine.new(layout).render

end