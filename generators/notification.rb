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
      id:         notification.id,
      post_id:    notification.post_id,
      comment_id: notification.comment_id,
      action:     notification.action.to_s,
      group:      group.name,
      actors:     actors
    }
    
    if !notification.actor_ids.empty?
      
      avatar_user_id = notification.actor_ids.first
      avatar_user = User.find(avatar_user_id)
      membership = group.memberships.where(user_id: avatar_user.id).first

      g_notification.merge!({
        avatar: AvatarGenerator.generate(membership, current_user),
      }) if membership # user may not have a membership if in invite
    
    end
  
    g_notification
    
  end

end