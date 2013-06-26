# Delete post or comment.
post '/:group_id/:model/delete', auth: [] do |group_id, model|

  @group = Group.find(group_id)
  
  @group.touch

  post = @group.posts.find(params[:post_id])

  resource = if model == 'comment'
    post.comments.find(params[:comment_id])
  elsif model == 'post'
    post
  end

  is_resource_owner = resource.owner.id == @user.id

  halt 403 unless resource.deletable_by? @user

  track @user, 'User deleted post'
  
  resource.destroy

end

# Like post or comment.
post '/:group_id/:model/like/:operation', auth: [] do |group_id, model, operation|

  @group = Group.find(group_id)
  
  @group.touch

  post = @group.posts.find(params[:post_id])

  likeable = model == 'comment' ?
  post.comments.find(params[:comment_id]) : post

  likeable.touch
  
  if operation == 'create'

    unless likeable.likes.where(owner_id: @user.id).first
      like = likeable.likes.create(owner_id: @user.id)
      like.save!
    end

    track @user, 'User liked ' + model
    
  elsif operation == 'delete'

    if like = likeable.likes.where(owner_id: @user._id)
      like.destroy
    end
    
    track @user, 'User unliked ' + model

  end

  status 200

end