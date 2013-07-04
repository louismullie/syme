require 'bundler'

Bundler.require
require './app'

namespace :assets do
  
  desc 'compile assets'
  
  task :compile => [:compile_js, :compile_css] do
  end
 
  desc 'compile javascript assets'
  
  task :compile_js do
    sprockets = Syme::Application.settings.sprockets
    asset     = sprockets['asocial.js']
    outpath   = File.join(Syme::Application.settings.assets_path, 'js')
    outfile   = Pathname.new(outpath).join('asocial.js')
 
    FileUtils.mkdir_p outfile.dirname

    asset.write_to(outfile)
    puts "successfully compiled js assets"
  end
 
  desc 'compile css assets'
  
  task :compile_css do
    sprockets = Syme::Application.settings.sprockets
    asset     = sprockets['asocial.css']
    outpath   = File.join(Syme::Application.settings.assets_path, 'css')
    outfile   = Pathname.new(outpath).join('asocial.css')
 
    FileUtils.mkdir_p outfile.dirname
 
    asset.write_to(outfile)
    
    puts "successfully compiled css assets"
    
  end
  
end