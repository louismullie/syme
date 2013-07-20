module User::Deletable

  def delete
    delete_likes_on_posts
    delete_likes_on_comments
    delete_uploads
    remove_from_notifications
    super
  end

  private

  def delete_likes_on_posts
    group.complete_posts.where('likes.owner_id' => id.to_s).each do |post|
      post.likes.where(owner_id: owner_id).destroy_all
    end
  end
  
  def delete_likes_on_comments
    group.complete_posts.where('comments.likes.owner_id' => id.to_s).each do |post|
      post.complete_comments.each { |c| c.likes.where(owner_id: id.to_s).destroy_all }
    end
  end
  
  def delete_uploads
    group.complete_uploads.where(owner_id: id.to_s).destroy_all
  end

  def delete_posts
    group.complete_posts.where(owner_id: id.to_s).destroy_all
  end

  def delete_comments
    group.complete_posts.where('comments.owner_id' => id.to_s).each do |post|
      post.complete_comments.where(owner_id: id.to_s).destroy_all
    end
  end

  def remove_from_notifications

    group.users.each do |user|
      notifications_where_involved.each do |notif|
        notif.actor_ids = notif.actor_ids - id.to_s
      end
    end

  end
  
  # Notifications the user is involved in.
  def notifications_where_involved
    user.notifications.where('actor_ids' => id.to_s)
  end


end