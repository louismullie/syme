module PostObserver::Publisher

  def publish_create(post)
    
    Asocial::Publisher.scatter(post.group, :create, :post) do |user|
      
      view = PostGenerator.generate(post, user)
      { target: post.id, view: view }
      
    end

  end

end