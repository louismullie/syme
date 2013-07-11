module NotificationObserver::Publisher

  def publish_delete(notification)

    group = begin
      Group.find(notification.group_id)
    rescue
      return # don't publish if group is deleted
    end
    
    data = { target: notification.id.to_s }

    MagicBus::Publisher.broadcast(
      group, :delete, :notification, data)

  end

end