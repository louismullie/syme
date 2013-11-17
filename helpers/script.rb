def csrf_token
  session[:csrf_token] ||= SecureRandom.uuid
end

def h(text)
  Rack::Utils.escape_html(text)
end