module Resource::Authorizable
  
  def editable_by?(user)
    user.id == owner.id ||
    user.is_at_least(:mod)
  end

  def deletable_by?(user)
    user.id == owner.id ||
    user.is_at_least?(:admin)
  end

end