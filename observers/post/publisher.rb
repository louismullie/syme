module PostObserver::Publisher

  def publish_create(post)

    MagicBus::Publisher.scatter(post.group, :create, :post) do |user|

      view = PostGenerator.generate(post, user)
      { target: post.id.to_s, view: view }

    end

  end

end