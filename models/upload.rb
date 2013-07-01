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
  
  # The encryption key
  field :key, type: String
  
  # The decryption keys
  field :keys, type: Hash
  
  # The storage type for the file.
  field :store, type: Symbol

  # Original filename of the file.
  field :filename, type: String
  
  # Size of upload in bytes.
  field :size, type: Integer

  # Image size as a string, e.g. 20x20
  field :image_size, type: String
  
  # Whether the upload has finished or not.
  field :finished, type: Boolean

  attr_accessible :type, :encrypted,
  :key, :keys, :filename, :size, :image_size

  has_one :thumbnail

end
