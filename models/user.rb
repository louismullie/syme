class User

  require_relative 'user/notifiable'
  require_relative 'user/deletable'

  include User::Notifiable
  include User::Deletable

  include Mongoid::Document

  has_and_belongs_to_many :groups
  has_and_belongs_to_many :hangouts
  
  embeds_many :notifications
  
  embeds_one :verifier
  
  has_many :posts
  has_many :memberships
  
  field :email, type: String
  field :invite_id, type: String

  field :full_name, type: String, default: 'Anonymous'

  field :activated, type: Boolean
  field :session_id, type: String
  field :keyfile, type: String

end
