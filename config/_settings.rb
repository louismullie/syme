require 'base64'

enable :logging

# Application-wide config.
set app_title: 'Syme'
set :haml, layout: false

set store: $store
set environment: $env
set secure: $secure

# Environment-specific config.
if $env == :development
  set :reload_templates, true
end

set :root, File.dirname(__FILE__)
set :sprockets, (Sprockets::Environment.new(root) { |env| env.logger = Logger.new(STDOUT) })

settings.sprockets.append_path 'public/js'
settings.sprockets.append_path 'public/css'

set :assets_prefix, 'assets'
set :assets_path, File.join(root, 'public', assets_prefix)

set :protection,
     except: [:http_origin, :remote_token, :frame_options],
     origin_whitelist: [
       'chrome-extension://diifaedmnfmmdmfgbjmdnggodliffefa',
       'localhost:5000', 'http://184.107.183.10',
       'http://syme.io', 'syme.io', 'www.syme.io']