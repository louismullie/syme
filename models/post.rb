class Post < Resource

  require_relative 'resource'

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
  
  # The encrypted content of the post.
  field :content, type: String
  
  # The upload ID of the post.
  field :upload_id, type: String
  
  # The encrypted keys for the post.
  field :keys, type: Hash, default: {}
  
  # The users mentioned in this post.
  field :mentions, type: Array, default: []

  # Each post may embed some likes.
  embeds_many :likes, as: :likeable
  
  # Each post may embed comments.
  embeds_many :comments

  # Attribute protection.
  attr_readonly :content, :keys, :upload_id
  attr_accessible :content, :keys, :upload_id
  
  # Whether the post has an associated
  # attachment stored on GridFS.
  def has_attachment?
    !upload_id.nil?
  end
  
  def upload
    has_attachment? ? group.uploads.find(upload_id) : nil
  end
  
  def delete
    if has_attachment?
      upload.destroy
    end
    super
  end
  
end