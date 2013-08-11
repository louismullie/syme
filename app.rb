module Syme

  require './base'

  class Application < Base
    
    VERSION = '0.1.1'
    
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
    
    def context
      
      unless @context
        @context = V8::Context.new

        sjcl_path = File.join(settings.root,
          'app', 'js', 'vendor', 'sjcl.js')

        @context.eval(File.read(sjcl_path))
      end
      
      @context
    
    end
    
    
  end

end
