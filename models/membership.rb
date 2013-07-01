class Membership

  require_relative 'membership/authorizable'

  include Membership::Authorizable

  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :user
  belongs_to :group
  
  has_one :user_avatar
  
  field :privilege, type: Symbol, default: :none

  field :keylist, type: String
  field :keylist_salt, type: String
  
  field :answer, type: String
  field :answer_salt, type: String

end
