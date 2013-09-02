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
        
    user.notifications.each do |notification|
      if notification.group_id == group.id.to_s
        notification.destroy
      end
    end

    group.complete_posts.each do |post|

      post.likes.each do |like|
        like.destroy if like.owner.id == user.id
      end
      
      post.complete_comments.each do |comment|
        if comment.owner.id == user.id
          comment.destroy
        end
        comment.likes.each do |like|
          like.destroy if like.owner.id == user.id
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
    
    group.invitations.each do |invitation|
      if invitation.invitee_id == member_id ||
         invitation.inviter_id == member_id
        invitation.destroy
      end
    end

    group.users.each do |user|
      user.notifications.each do |notification|
        if notification.actor_ids.include?(member_id)
          notification.actor_ids.delete(member_id)
        end
        if notification.actor_ids.empty?
          notification.destroy
        end
      end
      user.save!
    end
    
    user.save!
    
    group.users.delete(user)
    
    user.groups.delete(group)

    group.save!
    user.save!

    membership.destroy
    
    if user_id == @user.id.to_s
      action = :leave_group
    else
      action = :remove_from_group
    end
    
    group.users.each do |user|

      user.notify({
        action: action,
        create: { actor_ids: [ user_id ] }
      }, group)
      
    end

    track @user, 'User left group'
    
    if group.users.size == 0
      group.destroy
    end

  else

    error 403, 'unauthorized'

  end

  encrypt_response(empty_response)

end