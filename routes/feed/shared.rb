# Delete post or comment.
post '/:group/:model/delete', auth: [] do |group, model|

  @group = Group.where(name: group).first
  post = @group.posts.find(params[:post_id])

  resource = if model == 'comment'
    post.comments.find(params[:comment_id])
  elsif model == 'post'
    post
  end

  is_resource_owner = resource.owner.id == @user.id

  halt 403 unless resource.deletable_by? @user

  resource.destroy

end

# Like post or comment.
post '/:group/:model/like/:operation', auth: [] do |group, model, operation|

  @group = Group.where(name: group).first
  post = @group.posts.find(params[:post_id])

  likeable = model == 'comment' ?
  post.comments.find(params[:comment_id]) : post

  if operation == 'create'

    unless likeable.likes.where(owner_id: @user.id).first
      like = likeable.likes.create(owner_id: @user.id)
      like.save!
    end

  elsif operation == 'delete'

    if like = likeable.likes.where(owner_id: @user._id)
      like.destroy
    end

  end

  status 200

end