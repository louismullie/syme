module Syme

  class Base < Sinatra::Base

    # Recursive inline eval of Ruby files.
    def self.require_all(dir, opts={})
      path = File.dirname(File.expand_path(__FILE__))
      Dir["#{path}/#{dir}/**/*.rb"].each { |f| eval(File.read(f)) }
    end

    # Recursive inline require of Ruby files.
    def self.require_directory(dir)
      path = File.dirname(File.expand_path(__FILE__))
      Dir["#{path}/#{dir}/*.rb"].each { |f| require f }
    end

    # Set global session ID check.
    set(:auth) do |*roles|
      condition do
        halt 401 unless session[:user_id] # || env['HTTP_ACCESSTOKEN'])
      end
    end

    def authorized?
      @auth ||=  Rack::Auth::Basic::Request.new(request.env)
      @auth.provided? && @auth.basic? &&
      @auth.credentials && @auth.credentials == [ "mobile", "password"]
    end

    def protected!
      unless authorized?
        response['WWW-Authenticate'] = %(Basic realm="Restricted Area")
        throw(:halt, [401, "Oops... we need your login name & password\n"])
      end
    end
      
  end

end