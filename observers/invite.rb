class InviteObserver < Mongoid::Observer
  
  # require_relative 'invite/publisher'
  # include InviteObserver::Publisher
  
  def after_save(invite)
    
    return unless invite.state > 1
    
    inviter, invitee = invite.inviter, invite.invitee
    
    group = invite.group
    
    if invite.state == 2
      
      # Send e-mail requesting confirmation.
      # request_confirm(inviter, invitee, invite.token)
      
      inviter.notify({
        action: :request_invite_confirm,
        create: {
        actor_ids: [
          invitee.id
        ]
      }}, group)
      
      Asocial::Publisher.broadcast(
        group, :request, :invite, {
          group: group.name
      })

    elsif invite.state == 3
      
      group.users.each do |user|

        next if user.id == invitee.id

        user.notify({
          action: :confirm_invite,
          create: {
            actor_ids: [invitee.id]
          }
        }, group)

      end
      
      Asocial::Publisher.broadcast(
        group, :confirm, :invite, {
          group: group.name
      })

    end
  
  end



end