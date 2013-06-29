class Keyfile
  
  include Mongoid::Document
  
  embedded_in :user
  
  field :content, type: String

end