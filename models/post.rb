require_relative 'resource'

class Post < Resource

  include Resource::Likeable
  include Resource::Keyable
  include Resource::Authorizable
  include Resource::Deletable
  
  require_relative 'post/paginable'
  require_relative 'post/selectable'
  
  extend Post::Paginable
  extend Post::Selectable
  
  # Every post belongs to a group.
  belongs_to :group
  
  # A post may have an upload.
  has_one :attachment
  
  # The encrypted content of the post.
  field :content, type: String
  
  # The encrypted keys for the post.
  field :keys, type: Hash, default: {}
  
  # The users mentioned in this post.
  field :mentions, type: Array, default: []

  # Each post may embed some likes.
  embeds_many :likes, as: :likeable
  
  # Each post may embed comments.
  embeds_many :comments

  attr_accessible :content, :keys,
          :upload_id, :attachment
  
  def delete
    attachment.destroy if attachment
    super
  end
  
end