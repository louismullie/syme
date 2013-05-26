module Resource::Keyable

  def key_for_user(user)
    keys[user.id.to_s]
  end

end