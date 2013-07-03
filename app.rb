module Asocial

  set :protection, except: [:http_origin, :remote_token, :frame_options], origin_whitelist: ['chrome-extension://diifaedmnfmmdmfgbjmdnggodliffefa', 'localhost:5000', 'http://184.107.183.10', 'http://syme.io', 'syme.io', 'www.syme.io']
  
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
    LikeObserver, NotificationObserver, InvitationObserver,
    UserObserver

    Mongoid.instantiate_observers
    
  end

end
