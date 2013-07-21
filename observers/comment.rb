require_relative 'resource'

class CommentObserver < ResourceObserver
  
  require_relative 'comment/publisher'
  require_relative 'comment/notifier'
  
  include CommentObserver::Publisher
  include CommentObserver::Notifier
  
  def after_save(comment)
    if !comment.complete && comment.content != ''
      publish_create(comment)
      notify_create(comment)
      notify_mentioned(comment)
      comment.update_attribute(:complete, true)
    end
  end
  
  def after_create(comment); end
  
end