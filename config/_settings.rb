require 'base64'

enable :logging

# Application-wide config.
set app_title: 'Syme'
set :haml, layout: false

set store: $store
set secure: $secure

unless ENV['RACK_ENV'] == 'DEVELOPMENT'
  set :environment, :production
end

# Environment-specific config.
if settings.environment == :development
  set :reload_templates, true
end

set :root, File.dirname(__FILE__)

set :sprockets, (Sprockets::Environment.new(root) do |env|
  env.logger = Logger.new(STDOUT)
  env.append_path 'app/js'
  env.append_path 'app/css'
  env.js_compressor = Closure::Compiler.new
  env.css_compressor = :sass
end)

set :assets_prefix, 'assets'
set :assets_path, File.join(root, 'public', assets_prefix)

set :hbs_path, File.join(root, '.hbs', 'views')
set :upload_path, File.join(root, '../../uploads')

set :protection,
     except: [:http_origin, :remote_token, :frame_options],
     origin_whitelist: ['chrome-extension://kebgjahkgfpaeidbimpiefobehkjmani']

# Hangouts
set :clients, {}