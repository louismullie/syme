require_relative 'resource'

class PostObserver < ResourceObserver

  require_relative 'post/publisher'
  require_relative 'post/notifier'

  include PostObserver::Publisher
  include PostObserver::Notifier

end
