# Create comment
post '/users/:user_id/groups/:group_id/posts/:post_id/comments', auth: [] do |user_id, group_id, post_id|

  @group = @user.groups.find(group_id)

  @group.touch

  post = begin
    @group.complete_posts.find(post_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'post_not_found'
  end

  post.touch

  mentions = params[:mentioned_users] || []

  comment = post.comments.create(
    content: '', keys: {},
    encrypted: true,
    owner_id: @user.id,
    mentions: mentions
  )

  track @user, 'User commented on post'

  content_type :json
  
  CommentGenerator.generate(comment, @user).to_json

end

# Create comment
put '/users/:user_id/groups/:group_id/posts/:post_id/comments/:comment_id', auth: [] do |user_id, group_id, post_id, comment_id|

  error 400, 'missing_params' if !params[:content]
  
  message = JSON.parse(Base64.strict_decode64(params[:content]))
  
  @group = begin
    @user.groups.find(group_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'group_not_found'
  end
  
  post = begin
    @group.complete_posts.find(post_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'post_not_found'
  end
  
  comment = begin
    post.comments.find(comment_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'comment_not_found'
  end
  
  if (user_id  != @user.id.to_s)   ||
     (@user.id.to_s != comment.owner_id.to_s)
    error 403, 'access_unauthorized'
  end
  
  comment.content = message['message']
  comment.keys = message['keys']
  
  comment.save!
  
  empty_response

end