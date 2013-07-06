require_relative 'upload'

class Attachment < Upload

  belongs_to :post
  
  field :thumbnail_id, type: String
  
  attr_accessible :thumbnail_id
  
end