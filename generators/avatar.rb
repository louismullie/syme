class AvatarGenerator

  def self.generate(avatar, current_user)

    if avatar

      group = avatar.group

      current_key = avatar.key_for_user(current_user)

      owner_id = begin
        avatar.owner.id.to_s
      rescue
        ''
      end
      
      content = Base64.strict_encode64({
        message: avatar.key,
        keys: {
          current_user.id.to_s => current_key
        },
        senderId: owner_id
      }.to_json)

      {
        placeholder: false,
        id: avatar.id.to_s,
        owner_id: owner_id,
        keys: content,
        group_id: group.id.to_s
      }

    else

      { placeholder: true }

    end

  end

end