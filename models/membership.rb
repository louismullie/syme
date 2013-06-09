class Membership

  require_relative 'membership/authorizable'

  include Membership::Authorizable

  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :user
  belongs_to :group
  
  # Louis - move this to dedicated field.
  field :avatar_id, type: String

  field :privilege, type: Symbol, default: :none

  field :keylist, type: String
  field :keylist_salt, type: String
  field :new_keys, type: Hash, default: {}

  def avatar
    avatar_id ? group.uploads.find(avatar_id) : nil
  end

  def has_avatar?
    !avatar_id.nil?
  end

end
