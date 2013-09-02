class NotificationGenerator

  def self.generate_notifications(notifications, current_user)
    
    notifications.map do |notification|
      self.generate(notification, current_user)
    end
    
  end
  
  def self.generate(notification, current_user)
    
    # Mustn't access through group since user
    # may not be added to the group currently.
    actors = notification.actor_ids.select do |id|
      !User.where(id: id).first.nil?
    end.map do |id|
      User.find(id).full_name
    end.join_english

    if notification.group_name && notification.group_id
      group_name = notification.group_name
      group_id = notification.group_id
      group = Group.where(id: group_id).first
    else
      # OLD API - to MIGRATE
      # Want to completely denormalize the group.
      group = begin
        Group.find(notification.group_id)
      rescue Mongoid::Errors::DocumentNotFound
      end
      group_name = group.name
      group_id = group.id.to_s
      # END OLD API - to MIGRATE
    end
    
    # If all the users have been deleted, or the group
    # does not exist, flag the notification as invalid.
    
    # An exception is "group has been deleted" notifications.
    valid_exception = notification.action == 'delete_group'
  
    if actors.empty? || (group.nil? && !valid_exception)
      notification.destroy
      return { id: notification.id.to_s, invalid: true }
    end
    
    g_notification = {
      id:         notification.id.to_s,
      post_id:    notification.post_id.to_s,
      comment_id: notification.comment_id.to_s,
      action:     notification.action.to_s,
      read:       notification.read,
      group:      group_name,
      group_id:   group_id,
      actors:     actors,
      created_at: notification.created_at
        .strftime("%d/%m/%Y at %H:%M")
    }
=begin
    if !notification.actor_ids.empty?

      avatar_user_id = notification.actor_ids.first
      avatar_user = User.find(avatar_user_id)
      membership = group.memberships.where(user_id: avatar_user.id).first
      
      g_notification.merge!({
        owner: {
          id: avatar_user.id.to_s,
          avatar: AvatarGenerator.generate(
          membership.user_avatar, current_user)
        }
      }) if membership # user may not have a membership yet

    end
=end
    if notification.invitation
      g_notification[:invitation] =
        notification.invitation
    end

    g_notification

  end

end