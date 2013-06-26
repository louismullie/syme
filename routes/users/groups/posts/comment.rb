# Create comment
post '/:group_id/comment/create', auth: [] do |group_id|

  @group = @user.groups.find(group_id)
  post = @group.posts.find(params[:post_id])

  post.touch

  message = JSON.parse(params[:content])
  mentions = JSON.parse(params[:mentioned_users])

  comment = post.comments.create(
    content: message['content'],
    keys: message['keys'],
    encrypted: true,
    owner_id: @user.id,
    mentions: mentions
  )

  track @user, 'Commented on a post'

  comment.save!

  content_type :json
  { status: 'ok' }

end