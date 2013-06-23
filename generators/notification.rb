class NotificationGenerator

  def self.generate(notification, current_user)

    actors = notification.actor_ids.map do |id|
      # Mustn't access through current_group since user
      # may not be invited at that moment.
      User.find(id).full_name
    end.join_english

    # During migration only. Remove ASAP.
    group = Group.find(notification.group_id)

    g_notification = {
      id:         notification.id.to_s,
      post_id:    notification.post_id.to_s,
      comment_id: notification.comment_id.to_s,
      action:     notification.action.to_s,
      group:      group.name,
      group_id:   group.id.to_s,
      actors:     actors,
      created_at: notification.created_at.strftime("%d/%m/%Y at %H:%M")
    }

    if !notification.actor_ids.empty?

      avatar_user_id = notification.actor_ids.first
      avatar_user = User.find(avatar_user_id)
      membership = group.memberships.where(user_id: avatar_user.id).first

      g_notification.merge!({
        owner: {
          id: avatar_user.id.to_s,
          avatar: AvatarGenerator.generate(membership, current_user)
        }
      }) if membership # user may not have a membership if in invite - FIX

    end

    g_notification

  end

end