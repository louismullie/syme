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
        actor_ids: [  inviter.id.to_s ],
        invitation: InvitationGenerator.generate(invite)
    }}, group) if user
    
  end
  
  def after_save(invite)

    inviter, invitee = invite.inviter, invite.invitee

    group = invite.group

    if invite.state == 2
      
      inviter.notify({
        action: :invite_accept,
        create: {
          actor_ids: [invitee.id.to_s],
          invitation: InvitationGenerator
            .generate_pending_invitation(invite, inviter)
        }
      }, group)
      
      invitee.notifications.find_by(
        action: :invite_request,
        group_id: invite.group.id.to_s
      ).destroy
    
    elsif invite.state == 3 && !invite.notified

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
      
      inviter.notifications.find_by(
        action: :invite_accept,
        group_id: invite.group.id.to_s
      ).destroy
      
      MagicBus::Publisher.broadcast(
        group, :invitation, :distribute,
      { group_id: invite.group.id})
      
      invite.notified = true
      invite.save!

    end

  end



end