require_relative 'upload'

class UserAvatar < Upload

  belongs_to :group
  belongs_to :membership
  
end

class GroupAvatar < Upload

  belongs_to :group
  
end