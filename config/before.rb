before do

  # Get the current user's infos.
  if user_id = session[:user_id]
    begin
      @user = User.find(user_id)
    rescue Mongoid::Errors::DocumentNotFound
      # User deleted meanwhile
    end
  end

  # Set default content type.
  content_type 'application/json'
  
  # Obfuscate the server type
  response.headers['Server'] = 'syme'
  
  # If this is a preflight OPTIONS request, then short-circuit the
  # request, return only the necessary headers with status code 200.
  if request.request_method == 'OPTIONS'

    response.headers['Access-Control-Allow-Origin'] = 
    'chrome-extension://kebgjahkgfpaeidbimpiefobehkjmani'

    response.headers["Access-Control-Allow-Methods"] =
    "GET, POST, OPTIONS, PUT"

    response.headers["Access-Control-Allow-Headers"] =
    "X-Requested-With, X-Prototype-Version, X_CSRF_TOKEN"

    response.headers['Access-Control-Max-Age'] = '1728000'

    halt 200

  # For all responses, return the CORS access control headers.
  else

    response.headers['Access-Control-Allow-Origin'] = 
    'chrome-extension://kebgjahkgfpaeidbimpiefobehkjmani'
    
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT'
    response.headers['Access-Control-Max-Age'] = "1728000"

  end

   
end