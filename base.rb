module Syme

  class Base < Sinatra::Base

    # Recursive inline eval of Ruby files.
    def self.require_all(dir, opts={})
      Dir["./#{dir}/**/*.rb"].each { |f| eval(File.read(f)) }
    end

    # Recursive inline require of Ruby files.
    def self.require_directory(dir)
      Dir['./' + dir + '/*.rb'].each { |file| require file }
    end

    # Set global session ID check.
    set(:auth) do |*roles|
      condition { halt 401 unless session[:user_id] }
    end

  end

end