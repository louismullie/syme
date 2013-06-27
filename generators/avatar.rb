class AvatarGenerator
  
  def self.generate(membership_or_group, current_user)
    
    group = if membership_or_group.is_a?(Group)
      membership_or_group
    elsif membership_or_group.is_a?(Membership)
      membership_or_group.group
    end
    
    avatar = if membership_or_group.is_a?(Group)
      membership_or_group.group_avatar
    elsif membership_or_group.is_a?(Membership)
      membership_or_group.user_avatar
    end
    
    if avatar
      
      {
        placeholder: false,
        id: avatar.id.to_s,
        key: avatar.key_for_user(current_user),
        group_id: group.id.to_s
      }
      
    else
      
      { placeholder: true }
      
    end

  end
  
end