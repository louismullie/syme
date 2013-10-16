class ::EventAnalysis
  
  def self.identify(user, traits = {})
    Analytics.identify(
      email_id: self.unique_id(user),
      traits: traits
    )
  end
  
  def self.track(user_or_email, event, properties = {})

    Analytics.track(
      user_id: self.unique_id(user_or_email),
      event: event,
      properties: properties
    )

  end
  
  def self.unique_id(user_or_email)
    
    email = user_or_email.is_a?(String) ?
            user_or_email :
            user_or_email.email

    Digest::SHA2.hexdigest(email)
    
  end
  
end