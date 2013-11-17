def csrf_token
  session[:csrf]
end

def h(text)
  Rack::Utils.escape_html(text)
end