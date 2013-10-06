# Application-wide config.
set :app_title, 'Syme'
set :upload_path, File.join($root, '../../uploads')
set :running_tux, ENV['_'] && ENV['_'].index('tux')