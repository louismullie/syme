class UserGenerator

  def self.generate_short(user)
    {
      name: user.full_name
    }
  end

  def self.generate_full(user, group, current_user)
    {
      full_name:              user.full_name,
      post_count:             group.posts.where(owner_id: user.id.to_s).count,
      attachment_count:       group.posts.where(owner_id: user.id.to_s)
        .where(:attachment.ne => nil).count,
      is_current_user:        current_user.id.to_s == user.id.to_s,

      privilege_translation: {
        'admin' => 'admin', # t(:'admin.privilege_admin')
        'mod' => 'mod', # t(:'admin.privilege_mod')
        'none' => ''
      }[user.privilege]
    }
  end

end