module Resource::Likeable

  def liker_names
    likers.map(&:full_name).join_english
  end

  private

  def likers
    likes.map { |like| like.owner }
  end

end
