class UserListGenerator

  def self.generate(current_user, group)

    # To do: order by online

    group.users.map do |user|
      UserGenerator.generate_full(user, group, current_user)
    end

  end

end