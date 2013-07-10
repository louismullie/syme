delete '/users/:user_id/groups/:group_id/memberships/:member_id' do |_,group_id,member_id|

  group = @user.groups.find(group_id)
  
  user = begin
    group.users.find(member_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'user_not_found'
  end
  
  user_id = user.id.to_s
  
  membership = begin
    group.memberships.find_by(user_id: user.id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'membership_not_found'
  end

  if membership.deletable_by?(@user) || @user.id == user.id

    group.posts.each do |post|

      post.comments.each do |comment|
        if comment.owner.id == user.id
          comment.destroy
        end
      end

      if post.owner.id == user.id
        post.destroy
      end

    end

    group.uploads.each do |upload|
      if upload.owner.id == user.id
        upload.destroy
      end
    end

    group.users.each do |user|
      user.notifications.each do |notification|
        if notification.actor_ids.include?(member_id)
          notification.actor_ids.delete(member_id)
        end
      end
    end

    group.users.delete(user)
    user.groups.delete(group)

    group.save!
    user.save!

    membership.destroy
    
    group.users.each do |user|

      user.notify({
        action: :leave_group,
        create: { actor_ids: [ user_id ] }
      }, group)
      
    end

  else

    error 403, 'unauthorized'

  end

  empty_response

end