class LikeGenerator

  def self.generate(likeable, current_user)

    {
      has_likes: likeable.likes.count > 0,
      like_count: likeable.likes.count,
      liked_by_user: likeable.likes.where(
        owner_id: current_user.id).exists?,
      liker_names: likeable.liker_names
    }

  end

end