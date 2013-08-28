module ResourceObserver::Notifier

  def notify_mentioned(resource)
    
    mentioned_users = resource.mentions
    
    return unless mentioned_users
    
    user, group = resource.owner, resource.parent_group

    mentioned_users.each do |mentioned_user_id|
      
      mentioned_user = group.users.where(id: mentioned_user_id).first
      
      next unless mentioned_user
      
      mentioned_user.notify_mentioned_by_in(user, resource, group)

    end

  end

  def notify_create(resource)
    raise "Abstract method."
  end

end
