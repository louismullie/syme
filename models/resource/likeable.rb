module Resource::Likeable

  def liker_names
    likers.map(&:full_name).uniq.join_english
  end

  # Select the likes where the owner still exists,
  # then retrieve a unique list of likers.
  def likers
    likes.select { |like| like.owner }
         .map { |like| like.owner }.uniq
  end

end
