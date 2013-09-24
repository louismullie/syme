require 'base64'

enable :logging

# Application-wide config.
set app_title: 'Syme'
set :haml, layout: false

set store: $store
set secure: $secure

set :root, File.dirname(__FILE__)

set :assets_prefix, 'assets'
set :assets_path, File.join(root, 'public', assets_prefix)

set :hbs_path, File.join(root, '.hbs', 'views')
set :upload_path, File.join(root, '../../uploads')