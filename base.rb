module Asocial

  class Base < Sinatra::Base

    def self.require_specific(dir, files=[])
      files = files.map { |f| File.join(dir, "_#{f}") }
      files.each { |f| eval(File.read "#{f}.rb") }
    end

    # Recursive inline eval of Ruby files.
    def self.require_all(dir, opts={})
      Dir["./#{dir}/**/*.rb"].each do |f|
        next if f.index('deploy') || f =~ /^_/
        eval(File.read f)
      end
    end

    # Authorizations
    set(:auth) do |*roles|
      condition do
        halt 303 unless session[:user_id]
        authorized = roles.all? do |role|
          @user.is_at_least? role
        end
        halt 403 unless authorized if roles.any?
      end
    end

  end

end