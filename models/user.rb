class User

  require_relative 'user/notifiable'
  require_relative 'user/deletable'

  include User::Notifiable
  include User::Deletable

  include Mongoid::Document

  has_and_belongs_to_many :groups

  embeds_many :notifications

  has_many :posts
  has_many :memberships

  # Read-only attributes.
  field :email, type: String
  field :invite_id, type: String

  # Modifiable accessible attributes.
  field :avatar_id, type: String

  field :full_name, type: String, default: 'Anonymous'

  # Modifiable protected attributes.
  field :verifier, type: String
  field :verifier_salt, type: String

  field :keypair, type: String
  field :keypair_salt, type: String

  field :new_keys, type: Hash, default: {}

  field :activated, type: Boolean
  field :session_id, type: String

  # Attribute protection.
  attr_accessible :privilege, :avatar_id,
                  :full_name, :verifier_salt,
                  :invite_id, :email

  attr_protected  :public_key, :private_key, :verifier,
                  :session_id, :keypair, :keypair_salt,
                  :new_keys

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
