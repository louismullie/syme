module User::Notifiable

  # To refactor.
  def notify(params, group)

    return if params[:invalid]
    
    unread_selector, create_selector =
    params[:unread], params[:create]

    unread_selector.merge!({
      action: params[:action],
      read: false
    }) if unread_selector

    create_selector.merge!({
      action: params[:action],
      group_id: group.id.to_s,
      group_name: group.name
    })
    
    if unread_selector and notification =
       notifications.where(unread_selector).first
      
      actor_id = create_selector[:actor_ids].first
      
      # Prevent duplicate notifications
      unless notification.actor_ids.include?(actor_id.to_s)
        
        notification.actor_ids << actor_id.to_s 
        
        MagicBus::Publisher.broadcast(group, :update, :notification,
          NotificationGenerator.generate(notification, self))

      end

    else
      
      notification = notifications.create(create_selector)

      MagicBus::Publisher.send_to(id, :create, :notification,
      NotificationGenerator.generate(notification, self))

    end

    save!

  end

  def notify_mentioned_by_in(user,  post_or_comment, group)

    poc = post_or_comment

    if poc.is_a?(Comment)
      post_id = poc.post.id.to_s
      comment_id = poc.id.to_s
    else
      post_id = poc.id.to_s
    end

    action = comment_id ? :mention_in_comment : :mention_in_post

    notification = notifications.create(
      post_id: post_id,
      comment_id: comment_id,
      actor_ids: [user.id.to_s],
      action: action,
      group_name: group.name,
      group_id: group.id.to_s,
      read: false,
      group_id: group.id.to_s
    )
    
    save!
    
    MagicBus::Publisher.send_to(id, :create, :notification,
    NotificationGenerator.generate(notification, self))

  end

end