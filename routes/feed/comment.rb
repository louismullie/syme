# Create comment
post '/:group/comment/create', auth: [] do |group|

  @group = Group.where(name: group).first
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

  comment.save!

  content_type :json
  { status: 'ok' }

end