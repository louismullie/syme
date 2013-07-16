class LikeGenerator

  def self.generate(likeable, current_user)

    like_count = likeable.
      likes.map { |like| like.owner }.uniq.count
    
    {
      has_likes: likeable.likes.count > 0,
      like_count: like_count,
      liked_by_user: likeable.likes.where(
        owner_id: current_user.id).exists?,
      liker_names: likeable.liker_names
    }

  end

end