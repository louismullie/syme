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

set :sprockets, (Sprockets::Environment.new(root) do |env|
  env.logger = Logger.new(STDOUT)
  env.append_path 'public/js'
  env.append_path 'public/css'
  env.js_compressor = Closure::Compiler.new
  env.css_compressor = :sass
end)

set :assets_prefix, 'assets'
set :assets_path, File.join(root, 'public', assets_prefix)

set :upload_path, File.join(root, '.uploads')

set :protection,
     except: [:http_origin, :remote_token, :frame_options],
     origin_whitelist: [
       'chrome-extension://diifaedmnfmmdmfgbjmdnggodliffefa',
       'localhost:5000', 'http://184.107.183.10',
       'http://syme.io', 'syme.io', 'www.syme.io']