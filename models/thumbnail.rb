require_relative 'upload'

class Thumbnail < Upload

  belongs_to :group
  belongs_to :upload

end