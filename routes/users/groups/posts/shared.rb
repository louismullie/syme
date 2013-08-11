# Delete post or comment.
post '/:group_id/:model/delete', auth: [] do |group_id, model|

  @group = Group.find(group_id)
  
  @group.touch

  post_id = params[:post_id]
  
  post = begin
    @group.complete_posts.find(post_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'post_not_found'
  end
  
  comment_id = params[:comment_id]
  
  resource = if model == 'comment'
    track @user, 'User deleted comment'
    begin
      post.complete_comments.find(comment_id)
    rescue Mongoid::Errors::DocumentNotFound
      error 404, 'comment_not_found'
    end
  else
    track @user, 'User deleted post'
    post
  end

  is_resource_owner = resource.owner.id == @user.id

  halt 403 unless resource.deletable_by? @user
  
  resource.parent_group.users.each do |user|
    
    user.notifications.each do |notification|
      
      if model == 'post' && notification.
          post_id == resource.id.to_s ||
         model == 'comment' && notification.
          comment_id == resource.id.to_s
        notification.destroy
      end
      
    end
    
    user.save!
    
  end
  
  resource.destroy
  
  encrypt_response(empty_response)

end

# Like post or comment.
post '/:group_id/:model/like/:operation', auth: [] do |group_id, model, operation|

  @group = Group.find(group_id)
  
  @group.touch

  post = @group.complete_posts.find(params[:post_id])

  likeable = model == 'comment' ?
  post.complete_comments.find(params[:comment_id]) : post

  likeable.touch
  
  if operation == 'create'

    unless likeable.likes.where(owner_id: @user.id).first
      like = likeable.likes.create(owner_id: @user.id)
      like.save!
    end

    track @user, 'User liked ' + model
    
  elsif operation == 'delete'

    if like = likeable.likes.where(owner_id: @user.id)
      like.destroy
    end
    
    track @user, 'User unliked ' + model

  end

  status 200

end