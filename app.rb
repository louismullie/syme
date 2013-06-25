module Asocial

  require './base'

  class Application < Base

    Bundler.require :default, settings.environment

    configure { require_all 'config' }
    helpers   { require_all 'helpers' }

    require_directory 'models'
    require_directory 'observers'
    require_directory 'generators'
    
    require_all 'routes'
    
    # Model observers.
    Mongoid.observers = PostObserver, CommentObserver,
    LikeObserver, NotificationObserver, InviteObserver,
    UserObserver

    Mongoid.instantiate_observers
    
  end

end
