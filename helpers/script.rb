def csrf_token
  Rack::Csrf.csrf_token(env)
end

def h(text)
  Rack::Utils.escape_html(text)
end