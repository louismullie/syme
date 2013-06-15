module Asocial

  class Base < Sinatra::Base
    
    def self.require_all(dir, opts={})
      Dir["./#{dir}/**/*.rb"].each { |f| eval(File.read(f)) }
    end
    
    # Authorizations
    set(:auth) do |*roles|
      condition { halt 403 unless session[:user_id] }
    end

  end

end