module ResourceObserver::Publisher

  def publish_delete(resource)

    resource_class = resource.class.to_s
    type = resource_class.downcase.intern

    data = { target: resource.id.to_s }
    group = resource.parent_group

    MagicBus::Publisher.broadcast(group, :delete, type, data)

  end

end