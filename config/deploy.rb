require 'rvm/capistrano'
require 'bundler/capistrano'

# Application configuration.
set :application, 'asocial'

# Server login configuration.
set :user, 'web'
set :port, 1023
set :domain, '192.155.91.89'
set :use_sudo, true
default_run_options[:pty] = true

# Git login configuration.
default_run_options[:pty] = true
set :scm, :git
set :scm_verbose, true
set :repository, 'git@github.com:louismullie/asocial-showcase.git'
set :branch, 'release'

# Deployment configuration.
set :deploy_to, '/var/www/joinasocial.com'
set :deploy_via, :remote_cache

set :ssh_options, { forward_agent: true }

# Set location for apps.
set :location, '192.155.91.89'

role :web, location
role :app, location
role :db, location, primary: true

after 'deploy:update', 'bundle:install'
after 'deploy:update', 'foreman:export'
after 'deploy:update', 'foreman:restart'

# Bundler tasks.
namespace :bundle do
  
  desc "Installs the application dependencies"
  task :install, :roles => :app do
    run "cd #{current_path} && bundle --without development test"
  end
  
end

# Post-deploy tasks.
namespace :deploy do

  desc "Start the application services"
  task :start, roles: :app do

    run "cd #{release_path}"
    run "export ENVIRONMENT=PRODUCTION "
    run "bundle install"
    run "thin start --servers 3"

  end
 
  desc "Stop the application services"
  task :stop, roles: :app do
    run "kill $(lsof -i :3000 -t)"
    run "kill $(lsof -i :3001 -t)"
    run "kill $(lsof -i :3002 -t)"
  end

end