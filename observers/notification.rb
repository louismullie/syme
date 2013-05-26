class NotificationObserver < Mongoid::Observer
  
  require_relative 'notification/publisher'
  include NotificationObserver::Publisher
  
  def before_destroy(notification)
    publish_delete(notification)
  end
  
end