module ResourceObserver::Notifier

  def notify_mentioned(resource)

    return unless resource.mentions
    
    user = resource.owner
    full_names = resource.mentions
    group = resource.parent_group

    full_names.each do |full_name|

      user = User.where(full_name: full_name).first
      user.notify_mentioned_by_in(user, resource, group)

    end

  end

  def notify_create(resource)
    raise "Abstract method."
  end

end
