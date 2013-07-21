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
    self.posts.all.select do |post|
      post.complete == nil || post.complete == true
    end
  end
  
  def complete_uploads
    self.uploads.all.select do |upload|
      upload.complete == nil || upload.complete == true
    end
  end
  
end
