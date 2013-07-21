class Group

  include Mongoid::Document
  include Mongoid::Timestamps
  
  has_and_belongs_to_many :users

  has_many :invitations
  
  has_many :posts
  has_many :transfers
  has_many :memberships
  
  has_many :uploads
  has_many :attachments
  has_many :thumbnails
  has_many :user_avatars
  
  has_one :group_avatar
  
  field :name, type: String
  field :screen_name, type: String
  
  field :ack_create, type: Boolean
  field :state, type: Integer, default: 0
  
  field :palette, type: Array, default: []

  def complete_posts
    self.posts.where(complete: { '$in' => [nil, true]})
  end
  
end
