module Asocial

  require './base'

  class Application < Base

    Bundler.require :default, settings.environment

    configure { require_all 'config' }
    helpers   { require_all 'helpers' }

    Dir['./models/*.rb'].each { |file| require file }
    Dir['./observers/*.rb'].each { |file| require file }
    Dir['./generators/*.rb'].each { |file| require file }

    require_specific('routes', ['stream', 'catch', 'group'])
    
    require_all 'routes'
    
    Mongoid.observers = PostObserver, CommentObserver,
    LikeObserver, NotificationObserver, InviteObserver,
    UserObserver

    Mongoid.instantiate_observers
    
  end

end
