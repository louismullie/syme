module Membership::Authorizable

  Privileges = { admin: [:admin], mod: [:admin, :mod] }

  def is_at_least?(test)
    actual = self.privilege.intern
    Privileges[test].include?(actual)
  end
  
  def deletable_by?(user)
    get_membership(user).is_at_least?(:admin)
  end

  private

  def get_membership(user)
    group.memberships.find_by(user_id: user.id)
  end
  
end