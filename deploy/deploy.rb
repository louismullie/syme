require 'rvm/capistrano'

# Application configuration.
set :application, 'asocial'

# Server login configuration.
set :user, 'web'
set :port, 1023
set :domain, '198.27.65.229'
set :use_sudo, true
default_run_options[:pty] = true

# Git login configuration.
default_run_options[:pty] = true
set :scm, :git
set :scm_verbose, true
set :repository, 'git@github.com:louismullie/asocial-clean.git'
set :branch, 'foundation'

# Deployment configuration.
set :deploy_to, '/var/www/syme.io'
set :deploy_via, :remote_cache

set :ssh_options, { forward_agent: true }

# Set location for apps.
set :location, '198.27.65.229'

role :web, location
role :app, location
role :db, location, primary: true

after 'deploy:update', 'deploy:restart'

# Post-deploy tasks.
namespace :deploy do


  desc "Start the application services"
  
  task :restart, roles: :app do

    run "cd #{release_path} && "+
        "export RACK_ENV=DEVELOPMENT &&" +
        "bundle install && "+
        "thin restart -C #{release_path}/config/thin.conf"

  end

end