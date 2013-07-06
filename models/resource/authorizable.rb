module Resource::Authorizable

  def editable_by?(user)
    user.id == owner.id ||
    get_membership(user).is_at_least(:mod)
  end

  def deletable_by?(user)
    user.id == owner.id ||
    get_membership(user).is_at_least?(:admin)
  end

  private

  def get_membership(user)
    parent_group.memberships.find_by(user_id: user.id)
  end

end