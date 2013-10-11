def track(user_or_email, event, properties = {})
  
  email = user_or_email.is_a?(String) ?
          user_or_email :
          user_or_email.email
  
  hash = Digest::SHA2.hexdigest(email)
  
  Analytics.track(
    user_id: hash,
    event: event,
    properties: properties
  )
  
end