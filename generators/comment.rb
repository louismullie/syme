class CommentGenerator

  def self.generate(comment, current_user)

    {

      id: comment.id.to_s,
      content: comment.content,

      full_time: generate_timestamp(comment),

      key: comment.key_for_user(current_user),
      deletable: comment.deletable_by?(current_user),

      commenter: generate_commenter(comment, current_user),
      likeable: LikeGenerator.generate(comment, current_user)

    }

  end

  private

  def self.generate_timestamp(comment)

    format = "%d/%m/%Y at %H:%M" # t(:timestamp)
    comment.created_at.strftime(format)

  end


  def self.generate_commenter(comment, current_user)

    commenter = comment.owner
    commenter_membership = comment.parent_group
      .memberships.where(user_id: commenter.id).first

    {
      id: commenter.id.to_s,
      name: commenter.full_name(false),
      # user: commenter,
      avatar: AvatarGenerator.generate(
        commenter_membership, current_user)
    }

  end

end