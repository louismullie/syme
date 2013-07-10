module User::Notifiable

  # To refactor.
  def notify(params, group)

    unread_selector, create_selector =
    params[:unread], params[:create]

    unread_selector.merge!({
      action: params[:action],
      read: false
    }) if unread_selector

    create_selector.merge!({
      action: params[:action],
      group_id: group.id.to_s
    })

    if unread_selector and notification =
       notifications.where(unread_selector).first
      
      unless notification.actor_ids.include?(id.to_s)
        notification.actor_ids << id.to_s 
      end

      MagicBus::Publisher.broadcast(group, :update, :notification,
      NotificationGenerator.generate(notification, self))

    else

      notification = notifications.create(create_selector)

      MagicBus::Publisher.send_to(id, :create, :notification,
      NotificationGenerator.generate(notification, self))

    end

    save!

  end

  def notify_mentioned_by_in(user, post_or_comment, group)

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
      actor_ids: user.id.to_s,
      action: action,
      read: false,
      group_id: group.id.to_s
    )

    MagicBus::Publisher.broadcast(group, :update, :notification,
    NotificationGenerator.generate(notification, group, self))

  end

end