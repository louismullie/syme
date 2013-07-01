class InvitationObserver < Mongoid::Observer

  # require_relative 'invite/publisher'
  # include InviteObserver::Publisher

  def after_save(invite)

    return unless invite.state > 1

    inviter, invitee = invite.inviter, invite.invitee

    group = invite.group

    if invite.state == 2

      inviter.notify({
        action: :request_invite_confirm,
        create: {
        actor_ids: [
          invitee.id.to_s
        ]
      }}, group)

      MagicBus::Publisher.broadcast(
        group, :request, :invite, {
          group: group.name
      })

    elsif invite.state == 3

      group.users.each do |user|

        next if user.id.to_s == invitee.id.to_s

        user.notify({
          action: :confirm_invite,
          create: {
            actor_ids: [invitee.id.to_s]
          }
        }, group)

      end

      MagicBus::Publisher.broadcast(
        group, :confirm, :invite, {
          group: group.name,
          group_id: group.id.to_s
      })

    end

  end



end