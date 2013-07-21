class Transfer

  include Mongoid::Document
  
  belongs_to :group
  
  field :recipient_id, type: String
  field :sender_id, type: String
  field :upload_id, type: String
  
  field :size, type: Integer
  field :progress,
    type: Integer,default: 0
  
  def upload
    group.uploads.find(upload_id)
  end

end