module Resource::Likeable

  def liker_names
    likers.map(&:full_name).join_english
  end

  private

  def likers
    # Fail safe in case like.owner doesnt exist
    likes.select { |like| like.owner }
         .map { |like| like.owner }
  end

end
