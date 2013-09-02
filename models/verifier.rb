class Verifier
  
  include Mongoid::Document
  
  embedded_in :user
  
  field :content, type: String
  field :salt, type: String
  field :version, type: Integer
  
  # Version 0 - 1024-bit SRP verifier, 256-bit key
  # Version 1 - 1024-bit SRP verifier, 512-bit key
  # Version 2 - 2048-bit SRP verifier, 512-bit key

end
