class Hangout
  
  include Mongoid::Document
  
  has_and_belongs_to_many :users
  
end