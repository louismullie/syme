class ResourceObserver < Mongoid::Observer
  
  require_relative 'resource/publisher'
  require_relative 'resource/notifier'
  
  include ResourceObserver::Publisher
  include ResourceObserver::Notifier
  
  def after_save(resource)
    if !resource.complete
      publish_create(resource)
      notify_create(resource)
      notify_mentioned(resource)
      resource.update_attribute(:complete, true)
    end
  end
  
  def before_destroy(resource)
    publish_delete(resource)
  end
  
end