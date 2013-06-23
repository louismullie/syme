source 'https://rubygems.org'

group :application do
  
  gem 'rack', '>= 1.5.2'
  gem 'sinatra'
  gem 'thin'
  gem 'foreman'
  
end

group :security do
  
  gem 'rack-ssl',
    require: 'rack/ssl'

  gem 'content-security-policy'
  
  gem 'rack_csrf',
    require: 'rack/csrf'
  
end

# * Drivers * #

group :database do
  
  gem 'mongo'
  gem 'bson_ext'
  gem 'mongoid'
  gem 'magicbus'
  
end

group :extensions do
  
  gem 'pony'
  
  gem 'stripe'
  
  gem 'analytics-ruby',
    require: 'analytics-ruby'
  
end

group :deployment do
  
  gem 'capistrano'
  gem 'rvm-capistrano'
  
end

group :assets do
  
  gem 'sprockets'
  gem 'sass'
  gem 'i18n'

  gem 'guard'
  gem 'guard-haml'
  gem 'guard-steering'
  
  gem 'yajl-ruby',
    require: 'yajl/json_gem'

  gem 'closure-compiler'
  
  gem 'therubyracer',
    require: 'v8'
    
end

group :development do
  
  gem 'rake'
  
  gem 'rack-nocache',
    require: 'rack/nocache'
  
end