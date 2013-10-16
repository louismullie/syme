delete '/users/:user_id/groups/:group_id/posts/:post_id', auth: [] do |user_id, group_id, post_id|

  group = begin
    @user.groups.find(group_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'group_not_found'
  end
  
  post = begin
    group.complete_posts.find(post_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'post_not_found'
  end
  
  unless post.deletable_by?(@user)
    error 403, 'unauthorized'
  end
  
  group.touch
  
  group.users.each do |user|
    
    user.notifications.each do |notification|
      
      if notification.post_id == post_id
        notification.destroy
      end
      
    end
    
    user.save!
    
  end
  
  post.destroy
  
  empty_response

end

delete '/users/:user_id/groups/:group_id/posts/:post_id/comments/:comment_id', auth: [] do |user_id, group_id, post_id, comment_id|

  group = begin
    @user.groups.find(group_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'group_not_found'
  end
  
  post = begin
    group.complete_posts.find(post_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'post_not_found'
  end
  
  comment = begin
    post.complete_comments.find(comment_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'comment_not_found'
  end

  unless comment.deletable_by?(@user)
    error 403, 'unauthorized'
  end
  
  group.touch
  
  group.users.each do |user|
    
    user.notifications.each do |notification|
      
      if notification.comment_id == comment_id
        notification.destroy
      end
      
    end
    
    user.save!
    
  end
  
  comment.destroy
  
  empty_response

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

     EventAnalysis.track @user, 'User liked ' + model
    
  elsif operation == 'delete'

    if like = likeable.likes.where(owner_id: @user.id)
      like.destroy
    end
    
     EventAnalysis.track @user, 'User unliked ' + model

  end

  status 200

end