class UserObserver < Mongoid::Observer

  def after_create(user)
    identify_user(user)
  end

  def identify_user(user)
    Analytics.id.to_sentify(
      user_id: user.id.to_s,
      traits: {
        email: user.email,
        full_name: user.full_name
      }
    )
  end

end