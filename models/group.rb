class Group

  include Mongoid::Document
  include Mongoid::Timestamps
  
  has_and_belongs_to_many :users

  has_many :invitations
  
  has_many :posts
  has_many :transfers
  has_many :memberships
  
  has_many :uploads
  has_many :attachments
  has_many :thumbnails
  has_many :user_avatars
  
  has_one :group_avatar
  
  field :name, type: String
  field :screen_name, type: String
  field :question, type: String
  
  # Keylist for this group. 
  # Louis - move to dedicated model.
  field :keylist, type: String
  field :keylist_salt, type: String
  
  # Palette default must be the palette
  # color of the default group image
  field :palette, type: Array, default: []

end
