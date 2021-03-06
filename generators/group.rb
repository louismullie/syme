class GroupGenerator

  def self.generate(group, user)

    membership = group.memberships.find_by(user_id: user.id)
    deletable = membership.privilege == :admin

    invitation = group.invitations.where(
      invitee_id: user.id.to_s, state: 3).first
    
    avatar = group.group_avatar
    
    group_token = {
      id: group.id.to_s,
      name: group.name,
      avatar: AvatarGenerator.generate(avatar, user),
      user_count: group.users.count,
      palette: group.palette.to_json,
      updated_at: group.updated_at.iso8601,
      deletable: deletable
    }
    
    group_token.merge!({
      invitation_id: invitation.id.to_s,
      confirm: invitation.confirm.to_s
    }) if invitation

    group_token

  end

end