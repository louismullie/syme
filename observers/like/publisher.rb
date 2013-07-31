module LikeObserver::Publisher

  def publish_update(like, destroy = false)

    owner = like.likeable.owner
    
    if destroy && owner && like.likeable.is_a?(Post)
      
      owner.notifications.where(action: :like_on_post,
        post_id: like.likeable.id).destroy_all
      
      owner.save!
    
    elsif destroy && owner && like.likeable.is_a?(Comment)
      
      owner.notifications.where(action: :like_on_comment,
        comment_id: like.likeable.id).destroy_all
      
      owner.save!
      
    end

    group = like.likeable.parent_group

    MagicBus::Publisher.scatter(group, :update, :like) do |user|

      view = LikeGenerator.generate(like.likeable, user)
      data = { target: like.likeable.id.to_s, view: view }

    end

  end

end