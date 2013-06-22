module CommentObserver::Publisher

  def publish_create(comment)
    
    group = comment.parent_group
    
    MagicBus::Publisher.scatter(group, :create, :comment) do |user|
      
      view = CommentGenerator.generate(comment, user)
      data = { target: comment.post.id, view: view }
      
    end

  end

end