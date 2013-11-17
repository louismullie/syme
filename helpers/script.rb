def csrf_token
  session[:csrf] || 'null'
end

def h(text)
  Rack::Utils.escape_html(text)
end