class Membership

  require_relative 'membership/authorizable'

  include Membership::Authorizable

  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :user
  belongs_to :group

  has_one :user_avatar

  field :privilege, type: Symbol, default: :none
  field :last_email, type: DateTime

end