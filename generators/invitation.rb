class InvitationGenerator
  
  def self.generate(invitation)
    {
      
      id: invitation.id.to_s,
      state: invitation.state,
      
      inviter_id: invitation.inviter_id,
      inviter_name: invitation.inviter.full_name,
      
      invitee_id: invitation.invitee_id,
      invitee_full_name: invitation.invitee ?
        invitation.invitee.full_name : nil,
      
      group_id: invitation.group.id.to_s,
      group_name: invitation.group.name,
      token: invitation.token,
      
      request: invitation.request
      
    }
  end

  def self.generate_pending_invites(group, user)

    select = { inviter_id: user.id.to_s, state: { '$in' => [1, 2] } }

    group.invitations.where(select).map do |invitation|
      self.generate_pending_invitation(invitation, user)
    end

  end
  
  def self.generate_pending_invitation(invitation, user)
    {
      id: invitation.id.to_s,
      token: invitation.token,
      state: invitation.state,
      group_id: invitation.group.id.to_s,
      invitee_id: invitation.invitee_id,
      invitee_full_name: invitation.invitee ?
        invitation.invitee.full_name : invitation.email,
      accept: invitation.accept,
      email: invitation.email
    }
  end

end