class GroupGenerator

  require 'base64'
  
  def self.generate(group, user)

    group_token = {
      id: group.id.to_s,
      name: group.name,
      avatar: AvatarGenerator.generate(group, user),
      user_count: group.users.count,
      palette: group.palette.to_json
    }

    group_token

  end

end