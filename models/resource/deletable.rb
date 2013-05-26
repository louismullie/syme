module Resource::Deletable

  module Deletable

    def delete
      delete_notifications
      super
    end

    private

    # Deletes all the notifications
    # associated with the resource.
    def delete_notifications
      index = model_name + '_id'
      parent_group.users.each do |user|
        user.notifications.where(
        index => id.to_s).destroy_all
      end
    end

  end

end
