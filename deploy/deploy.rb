require 'rvm/capistrano'

# Application configuration.
set :application, 'syme'

# Server login configuration.
set :user, 'web'
set :port, 1023
set :domain, '198.27.65.229'
set :use_sudo, true
default_run_options[:pty] = true

# Git login configuration.
set :scm, :git
set :scm_verbose, true
set :repository, 'git@github.com:louismullie/syme.git'
set :branch, 'master'

# Deployment configuration.
set :deploy_to, '/var/www/syme.io'
set :deploy_via, :remote_cache

set :ssh_options, { forward_agent: true }

# Set location for apps.
set :location, '198.27.65.229'

role :web, location
role :app, location
role :db, location, primary: true

# Post-deploy tasks.
namespace :deploy do

  desc "Start the application services"
  
  task :restart, roles: :app do

    run "cd #{release_path} && thin stop --servers 3 -p 3000"
    run "#{try_sudo} rm -rf #{release_path}/tmp #{release_path}/log"

    run "cd #{release_path} && " +
        "export RACK_ENV=PRODUCTION &&" +
        "bundle install &&" +
        "thin start --servers 3 -p 3000 -e production"

  end

end