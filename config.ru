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

use ContentSecurityPolicy, directives: {
  # 'default-src' => settings.secure ? 'https: ' : '*',
  'script-src' => default,
  'style-src' => default,
  'object-src' => default,
  'font-src' => default,
  'connect-src' => default,
  # 'report-uri' => '/route/for/report'
  # Leave media-src, img-src and frame-src.
}

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