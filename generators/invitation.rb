class InvitationGenerator
  
  def self.generate(invite)
    {
      state: invitation.state,
      
      inviter_name: invitation.inviter.full_name,
      invitee_full_name: invitation.invitee ?
        invitation.invitee.full_name : nil,
      
      group_name: invitation.group.name,
      token: invitation.token,
      
      request: invitation.request
      
    }
  end

  def self.generate_pending_invites(group, user)

    select = { inviter_id: user.id.to_s, state: 2 }

    group.invitations.where(select).map do |invite|
      {
        id: invitation.id.to_s,
        token: invitation.token,

        invitee_id: invitation.invitee_id,
        invitee_full_name: invitation.invitee.full_name,

        request: invitation.request
        
      }
    end

  end

end