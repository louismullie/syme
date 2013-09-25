class FeedGenerator

  def self.generate(posts, current_user, current_group)

    posts = generate_posts(posts, current_user, current_group)
    user = generate_user(current_user, current_group)
    users = generate_user_list(current_user, current_group)
    mention_list = users.map{ |user| { id: user[:id], name: user[:full_name] } }.to_json
    invite = InvitationGenerator.generate_pending_invites(current_group, current_user)
    group = GroupGenerator.generate(current_group, current_user)

    {
      user: user,
      users: users,
      mention_list: mention_list,
      posts: posts,
      group: group,
      invite: invite
    }

  end

  def self.generate_user(current_user, current_group)

    membership = current_group.memberships
                  .find_by(user_id: current_user.id)
    avatar = membership.user_avatar

    {
      id: current_user.id.to_s,
      is_admin: membership.is_at_least?(:admin),
      is_mod: membership.is_at_least?(:mod),
      avatar: AvatarGenerator.generate(avatar, current_user)
    }

  end

  def self.generate_user_list(current_user, current_group)

    users = current_group.users
    warn "USER SIZE #{users}"
    
    user_list = user.map do |user|

      # Skip current user
      next if user.id.to_s == current_user.id.to_s

      membership = current_group.memberships.find_by(user_id: user.id)
      self.generate_user2(user, membership, current_user)

    end.reject { |entry| entry.nil? }

    # Prepend the current user to the group list
    current_membership = current_group.memberships.find_by(user_id: current_user.id)
    current_user = self.generate_user2(current_user, current_membership, current_user)

    user_list.unshift(current_user)
    
    warn "NOT UNIQUE: " + user_list.size.to_s
    warn user_list.uniq.size
    user_list.uniq

  end

  def self.generate_user2(user, membership, current_user)

    avatar = membership.user_avatar

    {
      id: user.id.to_s,
      is_current_user: current_user.id == user.id,
      full_name: user.full_name,
      deletable: membership.deletable_by?(current_user),
      avatar: AvatarGenerator.generate(avatar, current_user)
    }

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

end
