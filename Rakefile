require 'bundler'

Bundler.require
require './app'

namespace :extensions do

  task :compile_chrome do
    
    Rake::Task["assets:compile"].invoke
    
    # Compile and copy assets to extension directory.
    assets_path = Syme::Application.settings.assets_path
    js_path = File.join(assets_path, 'asocial.js')
    css_path = File.join(assets_path, 'asocial.css')

    FileUtils.mkdir_p('.extension/assets')
    FileUtils.cp(js_path, '.extension/assets')
    FileUtils.cp(css_path, '.extension/assets')
    
    # Copy worker scripts to extension directory.
    FileUtils.mkdir_p('.extension/js/workers')
    worker_path = settings.root + '/public/workers/*.js'
    
    Dir[worker_path].each do |worker|
      FileUtils.cp(worker, '.extension/js/workers')
    end
    
    # Copy main HTML file to extension directory.
    FileUtils.cp('./.hbs/views/layout.hbs', '.extension/asocial.html')
    
    # Copy fonts and images to extension directory.
    public_path = settings.root + '/public'
    FileUtils.mkdir_p('.extension/fonts')
    FileUtils.mkdir_p('.extension/img')
    FileUtils.cp_r(public_path + '/fonts', '.extension')
    FileUtils.cp_r(public_path + '/img', '.extension')
    
    # Copy other files to extension directory (/. important!)
    chrome_files = Dir.glob(settings.root + '/deploy/chrome/*')
    FileUtils.cp_r(chrome_files, '.extension')
    
    # Edit SERVER_URL to poll remote server.
    File.open('.extension/assets/asocial.js') do |file|
      contents = file.read
      contents.gsub!(/SERVER_URL[\s]*=[\s]*window\.location\.origin;/,
                    'SERVER_URL="http://198.27.65.229:81";')
      File.open('.extension/assets/asocial.js', "w+") { |f| f.write(contents) }
    end

  end
  
end

namespace :assets do
  
  desc 'compile assets'
  
  task :compile => [:compile_js, :compile_css] do
  end
 
  desc 'compile javascript assets'
  
  task :compile_js do
    
    sprockets = Syme::Application.settings.sprockets
    asset     = sprockets['asocial.js']
    outpath   = Syme::Application.settings.assets_path
    outfile   = Pathname.new(outpath).join('asocial.js')
 
    FileUtils.mkdir_p outfile.dirname

    asset.write_to(outfile)
    puts "successfully compiled js assets"
    
  end
 
  desc 'compile css assets'
  
  task :compile_css do
    
    sprockets = Syme::Application.settings.sprockets
    asset     = sprockets['asocial.css']
    outpath   = Syme::Application.settings.assets_path
    outfile   = Pathname.new(outpath).join('asocial.css')
 
    FileUtils.mkdir_p outfile.dirname
 
    asset.write_to(outfile)
    
    puts "successfully compiled css assets"
    
  end
  
end