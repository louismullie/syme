if settings.environment == :production
  # Initialize analytics API with secret key
  Analytics.init(secret: 'n5u5pkqotj7ik7d8n954')
else
  # Shim analytics API and log to console
  def track(*args); warn 'Tracking event'; end
end