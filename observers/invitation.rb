class InvitationObserver < Mongoid::Observer

  # require_relative 'invite/publisher'
  # include InviteObserver::Publisher

  def after_create(invite)
    
    user = User.where(email: invite.email).first
    
    inviter = invite.inviter
    group = invite.group
    
    user.notify({
      action: :invite_request,
      create: {
      actor_ids: [
        inviter.id.to_s
      ]
    }}, group) if user
    
  end
  
  def after_save(invite)

    inviter, invitee = invite.inviter, invite.invitee

    group = invite.group

    if invite.state == 2
      
      inviter.notify({
        action: :invite_accept,
        create: {
          actor_ids: [invitee.id.to_s]
        }
      }, group)
    
    elsif invite.state == 3

      group.users.each do |user|
        
        next if user.id.to_s == invitee.id.to_s
        
        user.notify({
          action: :new_group_user,
          create: {
            actor_ids: [invitee.id.to_s]
          }
        }, group)

      end
      
      invitee.notify({
        action: :invite_confirm,
        create: {
          actor_ids: [inviter.id.to_s]
        }
      }, group)
      
      MagicBus::Publisher.broadcast(
        group, :invitation, :distribute,
      { group_id: invite.group.id})

    end

  end



end