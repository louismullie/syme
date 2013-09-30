module Syme

  require './base'

  class Application < Base

    VERSION = '0.1.7'

    Bundler.require :default, settings.environment

    configure do
      set store:        $store
      set secure:       $secure
      set environment:  $env
      set :root,        $root
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

  end

end
