require 'bundler/setup'
require 'sinatra/base'

$root = File.dirname(__FILE__)

if ENV['RACK_ENV'] == 'PRODUCTION'
  
  $env = :production
  
=begin
  $env, $secure = :production, true

  # Enforce SSL for all connections.
  require 'rack/ssl'
  use Rack::SSL

  # Enable token protection against CSRF.
  require 'rack/csrf'
  use Rack::Csrf, raise: true

  # Enable protection against remote referrers.
  use Rack::Protection::RemoteReferrer

  # use Rack::Protection::EscapedParams

  # Enable browser feature detection.
  use Rack::CanIUse,
  features: [
    # Required for cryptography.
    'filereader', 'blobbuilder',
    'bloburls', 'typedarrays',
    'webworkers'
  ]

=end

else

  $env, $secure = :development, false

  # Disable caching alltogether.
  require 'rack/nocache'
  use Rack::Nocache

  # Show exceptions from Sinatra.
  use Rack::ShowExceptions

end

# Setup a strict CSP to discourage XSS.
require 'content-security-policy'

default = 'localhost:5000 asocial.io'

ContentSecurityPolicy.configure do |csp|
  csp['script-src'] = "'self' 'unsafe-eval'"
  csp['style-src'] = default
  csp['object-src'] = default
  csp['font-src'] = default
  csp['connect-src'] = default
  csp['img-src'] = default
  # default-src, report-uri
  # Leave media-src, img-src and frame-src.
end

# * Setup Memcache sessions * #
require 'securerandom'

# Setup server-side sessions.
use Rack::Session::Memcache,
  key: SecureRandom.hex(16),
  expire_after: 3600,
  secure: $secure,
  sidbits: 256,
  secure_random: SecureRandom


require './app'

run Asocial::Application