class LikeObserver < Mongoid::Observer
  
  require_relative 'like/publisher'
  require_relative 'like/notifier'
  
  include LikeObserver::Publisher
  include LikeObserver::Notifier
  
  def after_create(like)
    publish_update(like)
    notify_owner(like)
  end
  
  def after_destroy(like)
    publish_update(like, true)
  end
  
end