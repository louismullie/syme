module Syme

  require './base'

  class Application < Base
    
    VERSION = '0.0.3'
    
    Bundler.require :default, settings.environment

    configure { require_all 'config' }
    helpers   { require_all 'helpers' }

    require_directory 'models'
    require_directory 'observers'
    require_directory 'generators'
    
    require_all 'routes'
    
    Mongoid.observers = GroupObserver, InvitationObserver, 
    UserObserver, NotificationObserver, PostObserver,
    CommentObserver, LikeObserver    

    Mongoid.instantiate_observers
    
  end

end
