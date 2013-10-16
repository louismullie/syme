if settings.environment == :production
  # Initialize analytics API with secret key
  Analytics.init(secret: 'n5u5pkqotj7ik7d8n954')
else
  
  Analytics.class_eval do
    
      # Shim analytics API and log to console
    def track(*args); warn 'Tracking event'; end
    
    def identify(*args); warn 'Identifying user'; end
    
  end
  
end