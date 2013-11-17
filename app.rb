module Syme

  require './base'

  class Application < Base

    VERSION = '0.2.5'

    Bundler.require :default, settings.environment

    # Configure with globals defined in config.ru
    configure do
      set root:         $root
      set store:        $store
      set environment:  $env
    end

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
    
    $cordova_fix = false

  end

end
