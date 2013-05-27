require 'base64'

enable :logging

# Application-wide config.
set app_title: 'Ensemble'
set :haml, layout: false

set store: $store
set environment: $env
set secure: $secure
set root: $root

# Environment-specific config.
if $env == :development
  set :reload_templates, true
end