require 'bundler/setup'
require 'sinatra/base'
require 'securerandom'

$root = File.dirname(__FILE__)

# Default to production environment
if ENV['SYME_ENV'] == 'development'
  $env = :development
else
  ENV['SYME_ENV'] = 'production'
  $env = :production
end


# Setup server-side sessions.
require 'dalli'
require 'rack/session/dalli'

use Rack::Session::Dalli,
  key: 'session',
  cache: Dalli::Client.new,
  expire_after: 60 * 60 * 24 * 3

# Disable caching altogether.
require 'rack/nocache'
use Rack::Nocache

# Require the main application class.
require './app'

# Main application access point.
map '/' do
  run Syme::Application
end

# Handlebars configuration
HandlebarsAssets::Config.compiler = 'handlebars.min.js'
HandlebarsAssets::Config.compiler_path = 
File.join($root, 'app', 'js', 'vendor')

# For development, serve assets.
map '/assets' do

  environment = Sprockets::Environment.new

  environment.append_path 'app/js'
  environment.append_path 'app/css'
  environment.append_path 'app/views'

  environment.append_path HandlebarsAssets.path
  
  run environment

end if $env == :development