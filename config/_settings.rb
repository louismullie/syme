# Application-wide config.
set :app_title, 'Syme'
set :upload_path, File.join($root, '../../uploads')
set :deploy_path, File.join($root, 'deploy', 'chrome')
set :builds_path, File.join($root, 'builds')

set :public_path,  File.join($root, 'public')
set :worker_path, File.join(settings.public_path, 'workers')

set :running_tux, ENV['_'] && ENV['_'].index('tux')