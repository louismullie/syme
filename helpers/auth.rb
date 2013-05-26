def set_last_login_try
  if session[:last_login_try] &&
     (Time.now - session[:last_login_try]) > 10
    session[:login_tries] = 0
  else
    session[:login_tries] ||= 0
    session[:login_tries] += 1
    session[:last_login_try] = Time.now
  end
end

def too_many_login_tries?
  session[:login_tries] &&
  session[:login_tries] > 3
end