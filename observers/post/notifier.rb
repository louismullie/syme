module PostObserver::Notifier

  def notify_create(post)

    others = other_group_users(post)

    others.each do |user|
      user.notify({
        action: :new_post,
        create: {
          actor_ids: [post.owner.id.to_s],
          post_id: post.id.to_s
      }}, post.group)
    end

  end

  private

  def other_group_users(post)
    post.group.users.not_in(id: post.owner.id.to_s)
  end

end