require 'bundler/setup'
require 'sinatra/base'

$root = File.dirname(__FILE__)

if ENV['PRODUCTION'] == 'YES'

  $env, $secure = :production, true

  # Enforce SSL for all connections.
  require 'rack/ssl'
  use Rack::SSL

  # Setup a strict CSP to discourage XSS.
  require 'content-security-policy'

  default = 'localhost:5000 getasocial.com'

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


else

  $env, $secure = :development, false

  # Disable caching alltogether.
  require 'rack/nocache'
  use Rack::Nocache

  # Show exceptions from Sinatra.
  use Rack::ShowExceptions

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