class GroupGenerator

  require 'base64'

  def self.generate(group, user)

    membership = group.memberships.find_by(user_id: user.id)
    deletable = membership.privilege == :admin

    group_token = {
      id: group.id.to_s,
      name: group.name,
      avatar: AvatarGenerator.generate(group, user),
      user_count: group.users.count,
      palette: group.palette.to_json,
      updated_at: group.updated_at
        .strftime("%d/%m/%Y at %H:%M"),
      deletable: deletable
    }

    group_token

  end

end