class InviteGenerator
  
  def self.generate(invite)
    {
      state: invite.state,
      inviter_name: invite.inviter.get_name,
      invitee_full_name: invite.invitee ? invite.invitee.get_name : nil,
      group_name: invite.group.name,
      token: invite.token,
      question: invite.group.question,
      inviter_pub_key: invite.inviter_pub_key
    }
  end

  def self.generate_pending_invites(group, user)

    select = { inviter_id: user.id.to_s, state: 2 }

    group.invites.where(select).map do |invite|
      {
        id: invite.id.to_s,
        token: invite.token,

        invitee_id: invite.invitee_id,
        invitee_full_name: invite.invitee.full_name,

        inviter_priv_key_salt: invite.inviter_priv_key_salt,
        enc_inviter_priv_key: invite.enc_inviter_priv_key,
        invitee_pub_key: invite.invitee_pub_key,
        
        a_k: invite.a_k,
        PA_k: invite.PA_k
      }
    end

  end

end