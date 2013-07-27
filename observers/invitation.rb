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
      
      invitee.notifications.where(
        action: :invite_request,
        group_id: invite.group.id.to_s
      ).all.each do |notification|
        inviter_id = notification.invitation['inviter_id']
        if inviter_id == invite.inviter_id
          notification.destroy
        end
      end
      
      invitee.save!
    
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
      
      inviter.notifications.where(
        action: :invite_accept,
        group_id: invite.group.id.to_s
      ).all.each do |notification|
        invitee_id = notification.invitation['invitee_id']
        if invitee_id == invite.invitee_id
          notification.destroy
        end
      end
      
      inviter.save!
      
      MagicBus::Publisher.broadcast(
        group, :invitation, :distribute,
      { group_id: invite.group.id})
      
      invite.notified = true
      invite.save!
      
      group.touch

    end

  end



end