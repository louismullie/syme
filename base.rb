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
        halt 401 unless (session[:user_id] || env['HTTP_ACCESSTOKEN'])
      end
    end

  end

end