# Create comment
post '/:group_id/comment/create', auth: [] do |group_id|

  @group = @user.groups.find(group_id)

  @group.touch

  post = @group.posts.find(params[:post_id])

  post.touch

  
  message = JSON.parse(Base64.strict_decode64(
    params[:content]))
  
  mentions = JSON.parse(params[:mentioned_users])

  comment = post.comments.create(
    content: message['message'],
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