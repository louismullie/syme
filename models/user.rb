class User

  require_relative 'user/notifiable'
  require_relative 'user/deletable'

  include User::Notifiable
  include User::Deletable

  include Mongoid::Document

  has_and_belongs_to_many :groups

  embeds_many :notifications

  embeds_one :keyfile
  embeds_one :verifier
  
  has_many :posts
  has_many :memberships
  
  field :email, type: String
  field :invite_id, type: String

  field :full_name, type: String, default: 'Anonymous'

  field :new_keys, type: Hash, default: {}

  field :activated, type: Boolean
  field :session_id, type: String


  # Alternative name
  def get_name(with_last_name = true)
    # if !self.first_name or (self.first_name.empty? and self.last_name.empty?)
    #   "@" + self.username
    # else
    #   with_last_name ? [self.first_name, self.last_name].join(' ') : self.first_name
    # end
    self.full_name
  end

end
