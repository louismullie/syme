delete '/users/:user_id/groups/:group_id/memberships/:member_id' do |_,group_id,member_id|

  group = @user.groups.find(group_id)
  user = group.users.find(member_id)
  membership = group.memberships.find_by(user_id: user.id)

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

  else

    error 403, 'unauthorized'

  end

  empty_response

end