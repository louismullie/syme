module User::Authorizable

  Privileges = { admin: [:admin], mod: [:admin, :mod] }

  def is_at_least?(test)
    
    actual = self.privilege.intern
    Privileges[test].include?(actual)
    
  end

end