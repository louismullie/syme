module NotificationObserver::Publisher

  def publish_delete(notification)

    group = Group.find(notification.group_id)
    data = { target: notification.id.to_s }

    MagicBus::Publisher.broadcast(
      group, :delete, :notification, data)

  end

end