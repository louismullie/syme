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

default = 'localhost:5000 184.107.183.10 syme.io'

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
use Rack::Session::Cookie,
  key: SecureRandom.hex(16),
  expire_after: 3600,
  secure: $secure,
  sidbits: 256,
  secure_random: SecureRandom,
  secret: '8dg236rgd31238fb13vd65'

# Additional mime types
Rack::Mime::MIME_TYPES.merge!({
  ".eot" => "application/vnd.ms-fontobject",
  ".ttf" => "application/x-font-ttf",
  ".otf" => "font/otf",
  ".svg" => "image/svg+xml",
  ".woff" => "application/x-font-woff"
})

# Enable token protection against CSRF.
require 'rack/csrf'
use Rack::Csrf, skip: ['POST:/login/1', 'POST:/users']

# Customize Rack
# use Rack::Protection, except: :http_origin
#use Rack::Protection::HttpOrigin, origin_whitelist: [
#  'chrome-extension://diifaedmnfmmdmfgbjmdnggodliffefa',
#  'localhost:5000', 'http://184.107.183.10']

# Enable protection against remote referrers.
use Rack::Protection::RemoteReferrer

require './app'

map '/assets' do

  environment = Sprockets::Environment.new

  environment.append_path 'public/js'
  environment.append_path 'public/css'

  if $env == :production
    environment.js_compressor = Closure::Compiler.new
    environment.css_compressor = :sass
  end

  run environment

end

map '/' do
  run Asocial::Application
end