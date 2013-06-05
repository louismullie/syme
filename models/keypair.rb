class Keypair
  
  include Mongoid::Document
  
  embedded_in :user
  
  field :content, type: String
  field :salt, type: String

end
