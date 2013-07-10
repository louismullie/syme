class Notification
  
  include Mongoid::Document
  include Mongoid::Timestamps
  
  # Relations.
  embedded_in :user
  
  # Read-only attributes.
  field :post_id,    type: String
  field :comment_id, type: String
  field :group_id,   type: String
  field :action,     type: String
  field :invitation, type: Hash
  
  # Modifiable attributes.
  field :actor_ids,  type: Array
  field :read, type: Boolean, default: false
  
  # Attribute protections.
  attr_readonly   :post_id, :comment_id, :action
  attr_accessible :actor_ids, :post_id, :group_id,
                  :comment_id, :action, :read, :invitation
  
end