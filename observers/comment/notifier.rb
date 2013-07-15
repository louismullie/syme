module CommentObserver::Notifier

  def notify_create(comment)

    commenter_id = comment.owner_id
    commenter = User.find(commenter_id)

    notify_post_owner(comment, commenter)
    notify_commenters(comment, commenter)

  end

  private

  # If the owner of the post is not the commenter,
  # notify him that "X commented on [his] post".
  def notify_post_owner(comment, commenter)

    post = comment.post

    return if post.owner.id.to_s == commenter.id.to_s

    post.owner.notify({
      action: :comment_on_own_post,
      unread: { post_id: post.id.to_s },
      create: {
        post_id: post.id.to_s,
        comment_id: comment.id.to_s,
        actor_ids: [commenter.id.to_s]
    }}, post.group)

  end

  # Notify all other users that have commented on
  # the current post that there has been a new
  # comment posted on the same post.
  def notify_commenters(comment, commenter)

    post = comment.post
    group = post.group

    other_commenters(comment, commenter).each do |user|

      next if user.id.to_s == commenter.id.to_s

      user.notify({
        action: :comment_on_same_post,
        unread: { post_id: post.id.to_s },
        create: {
          post_id: post.id.to_s,
          comment_id: comment.id.to_s,
          actor_ids: [commenter.id.to_s]
      }}, group)

    end

  end

  # Get the unique list of all people who have commented
  # on the post this comment is contained in,
  # excluding the owner of the post and the commenter.
  def other_commenters(comment, commenter)

    commenters = comment.post.comments.map do |comment|
      comment.owner.id.to_s
    end

    post_owner = comment.post.owner

    commenters.uniq.reject do |id|
      id == commenter.id.to_s ||
      id == post_owner.id.to_s
    end

    group = comment.post.group
    
    commenters.map { |id| group.find(id) }

  end

end