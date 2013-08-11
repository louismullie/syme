before do

  # Get the current user's infos.
  if user_id = session[:user_id]
    @user = User.find(user_id)
  end

  # Set default content type.
  content_type 'application/json'
  
  # If this is a preflight OPTIONS request, then short-circuit the
  # request, return only the necessary headers with status code 200.
  if request.request_method == 'OPTIONS'

    headers['Access-Control-Allow-Origin'] = 
    'chrome-extension://kebgjahkgfpaeidbimpiefobehkjmani'

    response.headers["Access-Control-Allow-Methods"] =
    "GET, POST, OPTIONS"

    response.headers["Access-Control-Allow-Headers"] =
    "X-Requested-With, X-Prototype-Version, X_CSRF_TOKEN"

    headers['Access-Control-Max-Age'] = '1728000'

    halt 200

  # For all responses, return the CORS access control headers.
  else

    headers['Access-Control-Allow-Origin'] = 
    'chrome-extension://kebgjahkgfpaeidbimpiefobehkjmani'
  
    headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    headers['Access-Control-Max-Age'] = "1728000"

  end

   
end