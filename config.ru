require 'bundler/setup'
require 'sinatra/base'
require 'securerandom'

$root = File.dirname(__FILE__)

# Setup server-side sessions.
use Rack::Session::Memcache,
  key: 'session',
  expire_after: 60 * 60 * 24 * 3,
  secure: $secure,
  sidbits: 256,
  path: '/',
  secret: '8dg236rgd31238fb13vd65'

if ENV['RACK_ENV'].upcase == 'PRODUCTION'

=begin

  # Enforce SSL for all connections.
  require 'rack/ssl'
  use Rack::SSL

  # use Rack::Protection::EscapedParams

=end

  # Setup a strict CSP to discourage XSS.
  require 'content-security-policy'

  default = 'localhost:5000 getsyme.com:81'

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

=begin
  # Enable token protection against CSRF.
  require 'rack/csrf'

  use Rack::Csrf, skip: [
    # Allow registration without CSRF.
    'POST:/users',
    # Allow login without CSRF.
    'POST:/users/current/sessions'
  ]
=end

  require 'active_support'
  require 'rack/attack'

  # Setup server-side throttling.
  use Rack::Attack

  Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new

  Rack::Attack.throttle('login/email', limit: 6, period: 60) do |req|
    req.params['email'] if req.path =~ /login\/1/ && req.post?
  end

else

  # Disable caching alltogether.
  require 'rack/nocache'
  use Rack::Nocache

  # Show exceptions from Sinatra.
  use Rack::ShowExceptions

  # Dynamically generate assets
  map '/assets' do

    environment = Sprockets::Environment.new

    environment.append_path 'app/js'
    environment.append_path 'app/css'

    run environment

  end

end

# Additional mime types
Rack::Mime::MIME_TYPES.merge!({
  ".eot" => "application/vnd.ms-fontobject",
  ".ttf" => "application/x-font-ttf",
  ".otf" => "font/otf",
  ".svg" => "image/svg+xml",
  ".woff" => "application/x-font-woff"
})

require './app'

map '/' do
  run Syme::Application
end