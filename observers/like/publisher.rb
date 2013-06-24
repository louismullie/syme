module LikeObserver::Publisher

  def publish_update(like)

    group = like.likeable.parent_group

    MagicBus::Publisher.scatter(group, :update, :like) do |user|

      view = LikeGenerator.generate(like.likeable, user)
      data = { target: like.likeable.id.to_s, view: view }

    end

  end

end