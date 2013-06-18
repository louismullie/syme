class InviteGenerator
  
  def self.generate(invite)
    {
      state: invite.state,
      inviter_name: invite.inviter.get_name,
      invitee_full_name: invite.invitee ? invite.invitee.get_name : nil,
      group_name: invite.group.name,
      token: invite.token,
      question: invite.group.question,
      P: invite.P
    }
  end

end