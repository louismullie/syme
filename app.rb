module Asocial

  require './base'
  require './pubsub'
  
  class Application < Base

    disable :protection # Hahaha
    
    Bundler.require :default, settings.environment

    configure { require_all 'config' }
    helpers   { require_all 'helpers' }

    Dir['./models/*.rb'].each { |file| require file }
    Dir['./observers/*.rb'].each { |file| require file }
    Dir['./generators/*.rb'].each { |file| require file }

    require_all 'routes'

    # to remove
    helpers Fifty

    def initialize(*args, &block)
      Fifty.context = self
      super(*args, &block)
    end

    def call(env)
      Fifty.logger = env['rack.logger']
      super(env)
    end
    # to remove
    
    Mongoid.observers = PostObserver, CommentObserver,
    LikeObserver, NotificationObserver, InviteObserver,
    UserObserver

    Mongoid.instantiate_observers

  end

end
