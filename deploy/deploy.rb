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

    # thin restart -P /var/www/syme.io/shared/thin.pid -l /var/www/syme.io/shared/thin.log -O -e production -s 3 -p 3000
    pid_path = "#{shared_path}/thin.pid"
    log_path = "#{shared_path}/thin.log"
    
    thin_opts = "-P #{pid_path} -l #{log_path} -O"
    thin_call = "-e production -s 3 -p 3000 #{thin_opts}"
    
    run "cd #{current_release} && " +
        "bundle install && " +
        "thin restart #{thin_call}"

  end

end