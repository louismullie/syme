class UserGenerator

  def self.generate(user, current_user)
    
    is_current_user = current_user.id.to_s == user.id.to_s
    
    user_hash = {
      id:                     user.id.to_s,
      full_name:              user.full_name,
      email:                  user.email,
      is_current_user:        is_current_user
    }
    
    if is_current_user
      user_hash.merge!({ keyfile: user.keyfile })
    end
    
    user_hash
    
  end

end