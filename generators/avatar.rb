class AvatarGenerator

  def self.generate(membership_or_group, current_user, override = false)

    group = if membership_or_group.is_a?(Group)
      membership_or_group
    elsif membership_or_group.is_a?(Membership)
      membership_or_group.group
    end unless override

    avatar = if membership_or_group.is_a?(Group)
      membership_or_group.group_avatar
    elsif membership_or_group.is_a?(Membership)
      membership_or_group.user_avatar
    end unless override

    avatar = membership_or_group if override
    group = avatar.group if override

    if avatar

      current_key = avatar.key_for_user(current_user)

      content = Base64.strict_encode64({
        message: avatar.key,
        keys: {
          current_user.id.to_s => current_key
        },
        senderId: avatar.owner.id.to_s
      }.to_json)

      {
        placeholder: false,
        id: avatar.id.to_s,
        owner_id: avatar.owner.id.to_s,
        keys: content,
        group_id: group.id.to_s
      }

    else

      { placeholder: true }

    end

  end

end