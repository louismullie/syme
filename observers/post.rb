require_relative 'resource'

class PostObserver < ResourceObserver

  require_relative 'post/publisher'
  require_relative 'post/notifier'

  include PostObserver::Publisher
  include PostObserver::Notifier
  
  def after_save(post)
    if !post.complete
      publish_create(post)
      notify_create(post)
      notify_mentioned(post)
      post.update_attribute(:complete, true)
    end
  end
  
  def after_create(post); end
  
end
