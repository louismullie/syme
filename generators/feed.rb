class FeedGenerator

  def self.generate(posts, current_user, current_group)

    posts = generate_posts(posts, current_user, current_group)
    user = generate_user(current_user, current_group)
    users = generate_user_list(current_group, current_user)
    invite = generate_pending_invites(current_group, current_user)
    group = GroupGenerator.generate(current_group, current_user)

    {
      user: user,
      users: users,
      posts: posts,
      group: group,
      invite: invite
    }

  end

  def self.generate_user(current_user, current_group)

    membership = current_group.memberships
                  .find_by(user_id: current_user.id)

    {
      id: current_user.id.to_s,
      is_admin: membership.is_at_least?(:admin),
      is_mod: membership.is_at_least?(:mod),
      avatar: AvatarGenerator.generate(membership, current_user)
    }

  end

  def self.generate_user_list(current_group, current_user)
    current_group.users.map do |user|
      membership = current_group.memberships.where(user_id: user.id).first
      {
        id: user.id.to_s,
        is_current_user:
        current_user.id == user.id,
        full_name: user.full_name,
        avatar: AvatarGenerator.generate(membership, current_user)
      }
    end
  end

  def self.generate_posts(posts, current_user, current_group)

    posts.map do |post|
      PostGenerator.generate(post, current_user)
    end

  end

  # Get last updated_at pill in order to decide
  # whether to show one or not in each post
  def self.generate_last_date(posts, last_timestamp)

    last_date = last_timestamp ?
    Time.at(last_timestamp.to_i)
    .round_to_day : Time.now + 1
    show_updated_at = nil

    # Generate a big hash for each post
    posts.map do |post|

      # Determine if updated_at pill should be shown
      if post.updated_at.round_to_day < last_date

        last_date = post.updated_at.round_to_day
        show_updated_at = post.updated_at

      else; show_updated_at = false; end

    end

    show_updated_at

  end

  def self.generate_pending_invites(group, user)

    select = { inviter_id: user.id.to_s, state: 2 }

    group.invites.where(select).map do |invite|
      {
        id: invite.id.to_s,
        token: invite.token,

        invitee_id: invite.invitee_id,
        invitee_full_name: invite.invitee.full_name,

        k_P: invite.k_P,
        PA_k: invite.PA_k,
        p_sB: invite.p_sB,
        sB_salt: invite.sB_salt,
        a_P: invite.a_P
      }
    end

  end

end
