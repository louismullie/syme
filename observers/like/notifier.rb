module LikeObserver::Notifier
  
  # Notify the owner of the post or comment
  # that is being liked, except if autolike.
  def notify_owner(like)
    
    likeable = like.likeable
    group = likeable.parent_group
    
    owner, post, comment =
    get_likeable_infos(likeable)
    
    liker = User.find(like.owner_id)
    
    return if owner.id == liker.id
    
    base_selector = { post_id: post.id }
    
    base_selector.merge!({
      comment_id: comment.id
    }) if comment
    
    action = comment ? :like_on_comment : :like_on_post
    
    owner.notify(
      {action: action,
      unread: base_selector,
      create: base_selector.merge(
        { actor_ids: [liker.id] }
      )}, group
    )
    
  end
  
  private
  
  def get_likeable_infos(likeable)
    if likeable.is_a?(Post)
      post = likeable
      comment = nil
      owner = post.owner
    elsif likeable.is_a?(Comment)
      post = likeable.post
      comment = likeable
      owner = comment.owner
    end
    [owner, post, comment]
  end

end