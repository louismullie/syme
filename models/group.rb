class Group

  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :question, type: String
  field :answer, type: String

  # Keylist for this group. 
  # Louis - move to dedicated model.
  field :keylist, type: String
  field :keylist_salt, type: String
  
  # Louis - move this to a dedicated field.
  # (Subclass Upload with an Avatar class).
  field :avatar_id, type: String
  
  # Palette default must be the palette
  # color of the default group image
  field :palette, type: Array, default: []

  has_and_belongs_to_many :users

  has_many :invites
  has_many :uploads
  has_many :posts
  has_many :transfers
  has_many :memberships

  def avatar
    avatar_id ? uploads.find(avatar_id) : nil
  end

  def has_avatar?
    !avatar_id.nil?
  end

end
