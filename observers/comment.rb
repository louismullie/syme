require_relative 'resource'

class CommentObserver < ResourceObserver
  
  require_relative 'comment/publisher'
  require_relative 'comment/notifier'
  
  include CommentObserver::Publisher
  include CommentObserver::Notifier
  
end