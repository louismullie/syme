require_relative 'resource'

class Upload < Resource

  include Resource::Keyable
  
  require_relative 'upload/storable'
  require_relative 'upload/detectable'
  
  include Upload::Storable
  include Upload::Detectable

  # Relations
  belongs_to :group

  #  General fields (read-only)  #

  # Type of upload (:post or :avatar).
  field :type, type: Symbol
  # Whether the upload is encrypted or not.
  field :encrypted, type: Boolean
  # The keys for encryption.
  field :keys, type: Hash
  # The storage type for the file.
  field :store, type: Symbol

  # Original filename of the file.
  field :filename, type: String
  # Size of upload in bytes.
  field :size, type: Integer

  # Whether the upload has finished or not.
  field :finished, type: Boolean
  
  # Attribute protection.
  attr_readonly :type, :encrypted,
  :keys, :filename

  attr_accessible :type, :encrypted,
  :keys, :filename, :size

  # ID of thumbnail for images.
  field :thumbnail_id, type: String
  # Image size as a string, e.g. 20x20
  field :image_size, type: String

  # Attribute protection.
  attr_readonly   :image_size
  attr_accessible :image_size
  attr_protected  :thumbnail_id
  
end
