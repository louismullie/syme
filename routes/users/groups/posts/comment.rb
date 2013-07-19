# Create comment
post '/users/:user_id/groups/:group_id/posts/:post_id/comments', auth: [] do |user_id, group_id, post_id|

  @group = @user.groups.find(group_id)

  @group.touch

  post = begin
    @group.posts.find(post_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'post_not_found'
  end

  post.touch

  message = JSON.parse(Base64.strict_decode64(
    params[:content]))
  
  mentions = params[:mentioned_users] || []

  comment = post.comments.create(
    content: message['message'],
    keys: message['keys'],
    encrypted: true,
    owner_id: @user.id,
    mentions: mentions
  )

  track @user, 'User commented on post'

  comment.save!

  content_type :json
  
  CommentGenerator.generate(comment, @user).to_json

end