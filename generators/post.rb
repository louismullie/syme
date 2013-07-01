class PostGenerator

  CommentsPerThread = 3

  def self.generate(post, current_user)

    comments = generate_comments(post, current_user)
    owner = generate_owner(post, current_user)
    date = generate_date(post)

    current_key = post.key_for_user(current_user)
    deletable = post.deletable_by?(current_user)
    
    content = Base64.strict_encode64({
      message: post.content,
      keys: {
        current_user.id => current_key
      },
      senderId: post.owner.id.to_s
    }.to_json)
    
    attachment = AttachmentGenerator.generate(post, current_user)

    {
      # General post information.
      id: post.id.to_s,
      owner: owner,
      content: content,
      key: current_key,
      deletable: deletable,

      # Time information.
      date: date,
      full_time: post.created_at
        .strftime("%d/%m/%Y at %H:%M"), # t(:some time locale)
      created_at: post.created_at.iso8601,
      timestamp: post.created_at.to_i,

      # Attachment information.
      has_attachment: !post.attachment.nil?,
      attachment: attachment,

      # Likes and likers.
      likeable: LikeGenerator.generate(post, current_user),

      # Comment information.
      comments: comments,
      comment_count: comments.count,
      comments_collapsed: comments.count >
        CommentsPerThread ? '' : 'hidden',
      comments_collapsed_count: comments.count -
        CommentsPerThread
    }

  end

  def self.generate_comments(post, current_user)

    post.comments.each_with_index.map do |comment, i|

      result = CommentGenerator.generate(comment, current_user)
      result.merge({
        hidden: (i < post.comments.count -
        CommentsPerThread) ? 'comment-hidden' : ''
      })

    end

  end

  def self.generate_date(post)
    {
      day: post.updated_at.day,
      month: post.updated_at.strftime('%b'),
      year: post.updated_at.strftime('%y')
    }
  end

  def self.generate_owner(post, current_user)

    membership = post.group.memberships.where(
      user_id: post.owner.id).first

    {
      id: post.owner.id.to_s,
      user: post.owner,
      name: post.owner.full_name,
      avatar: AvatarGenerator.generate(
        membership, current_user)
    }

  end

end
