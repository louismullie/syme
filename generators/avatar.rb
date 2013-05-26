class AvatarGenerator
  
  def self.generate(membership_or_group, current_user)
    
    group = if membership_or_group.is_a?(Group)
      membership_or_group
    elsif membership_or_group.is_a?(Membership)
      membership_or_group.group
    end
    
    if membership_or_group.has_avatar?
      
      avatar = membership_or_group.avatar
      
      {
        placeholder: false,
        id: avatar.id.to_s,
        key: avatar.key_for_user(current_user),
        group_name: group.name
      }
      
    else
      
      { placeholder: true }
      
    end

  end
  
end