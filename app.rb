module Asocial

  require './base'
  require './pubsub'
  
  class Application < Base

    disable :protection # Hahaha
    
    Bundler.require :default,
    settings.environment

    configure do
      require_specific 'config', ['settings']
      require_all 'config'
    end

    helpers   { require_all 'helpers' }

    helpers Fifty

    Dir['./models/*.rb'].each { |file| require file }
    Dir['./observers/*.rb'].each { |file| require file }
    Dir['./generators/*.rb'].each { |file| require file }

    require_specific('routes', ['stream', 'catch', 'group'])

    require_all 'routes'

    def initialize(*args, &block)

      Fifty.context = self
      super(*args, &block)

    end

    def call(env)
      Fifty.logger = env['rack.logger']
      super(env)
    end

    Mongoid.observers = PostObserver, CommentObserver,
    LikeObserver, NotificationObserver, InviteObserver

    Mongoid.instantiate_observers

  end

end
