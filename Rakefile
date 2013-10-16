require 'bundler'
  
$root = File.dirname(__FILE__)
  
Bundler.require
require './app'

namespace :extensions do

  task :compile_chrome do
    
    # Get the build path from the settings.
    settings = Syme::Application.settings
    version = Syme::Application::VERSION
    
    # Create a random build ID
    build_id = SecureRandom.uuid
    
    # Create the target build path
    builds_path = settings.builds_path
    build_path = File.join(builds_path,
      'chrome', version, build_id)
    
    # Get shortcuts for repeated use
    assets_path = settings.assets_path
    deploy_path = settings.deploy_path
    public_path = settings.public_path
    worker_path = settings.worker_path
    
    # Delete old version of the extension.
    FileUtils.mkdir_p(build_path)
    
    # Compile the JS and CSS assets using Sprockets.
    Rake::Task["assets:compile"].invoke
    
    # Create the directories in the target build.
    directories = ['assets', 'workers', 'fonts', 'img']
    directories.each do |directory|
      FileUtils.mkdir_p(File.join(build_path, directory))
    end
    
    # Get the path to the compiled JS and CSS.
    js_path = File.join(assets_path, 'app.js')
    css_path = File.join(assets_path, 'app.css')

    # Copy compiled JS and CSS to target /assets directory.
    FileUtils.cp(js_path, File.join(build_path, 'assets'))
    FileUtils.cp(css_path, File.join(build_path, 'assets'))
    
    # Copy unminified workers to the target /workers directory.
    Dir[File.join(worker_path, '*.js')].each do |worker|
      FileUtils.cp(worker, File.join(build_path, 'workers'))
    end
    
    # Copy main HTML file to extension directory.
    layout_path = File.join('app', 'js', 'views', 'layout.hamlbars')
    layout_html = Haml::Engine.new(File.read(layout_path)).render
    
    # Write HTML content of layout to the layout file.
    File.open(File.join(build_path, 'syme.html'), 'w+') do |file|
      file.write(layout_html)
    end
    
    # Copy fonts and images to extension directory.
    FileUtils.cp_r(File.join(public_path, 'fonts'), build_path)
    FileUtils.cp_r(File.join(public_path, 'img'), build_path)
    
    # Copy other files to extension directory
    chrome_files = Dir.glob(File.join(deploy_path, '*'))
    FileUtils.cp_r(chrome_files, build_path)
    
    # Build path to app.js file
    app_path = File.join(build_path, 'assets', 'app.js')
    
    # Edit SERVER_URL to poll remote server.
    search = /SERVER_URL[\s]*=[\s]*[^;]*/
    replace = 'SERVER_URL="https://getsyme.com:81"'
    
    # Replace SERVER_URL in the app.js file.
    File.open(app_path, 'w+') do |f|
      f.write(f.read.gsub(search, replace))
    end
  
    # Create zip file in builds/chrome folder.
    zip_dir = File.join('builds', 'chrome')
    zip_file = File.join(zip_dir, "syme-#{version}.zip")
    `cd #{build_path} && zip -r #{zip_file} . && mv #{zip_file} ../#{zip_file}`
    
  end
  
end

namespace :assets do
  
  desc 'compile assets'
  
  task :compile => [:compile_js, :compile_css] do
  end
 
  desc 'compile javascript assets'
  
  task :compile_js do
    
    sprockets = Syme::Application.settings.sprockets
    asset     = sprockets['app.js']
    outpath   = Syme::Application.settings.assets_path
    outfile   = Pathname.new(outpath).join('app.js')
 
    FileUtils.mkdir_p(outfile.dirname)

    asset.write_to(outfile)
    puts "successfully compiled js assets"
    
  end
 
  desc 'compile css assets'
  
  task :compile_css do
    
    sprockets = Syme::Application.settings.sprockets
    asset     = sprockets['app.css']
    outpath   = Syme::Application.settings.assets_path
    outfile   = Pathname.new(outpath).join('app.css')
 
    FileUtils.mkdir_p outfile.dirname
 
    asset.write_to(outfile)
    
    puts "successfully compiled css assets"
    
  end
  
end