require_relative 'resource'

class Comment < Resource
  
  include Resource::Likeable
  include Resource::Authorizable
  include Resource::Deletable
  include Resource::Keyable
  
  # Relations.
  embedded_in :post
  embeds_many :likes, as: :likeable

  # Fields.
  field :content, type: String
  field :keys, type: Hash, default: {}

  # The users mentioned in this comment.
  field :mentions, type: Array, default: []
  
  # The users mentioned in this post.
   field :mentions, type: Array, default: []
  
  # Attribute protection.
  attr_readonly :content, :keys
  attr_accessible :content, :keys, :mentions

  # Validations.
  validates_uniqueness_of :content,
    scope: [:owner_id, :created_at]
  
end
