require_relative 'upload'

class Attachment < Upload

  belongs_to :post
  
end