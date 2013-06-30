class Invitation

  include Mongoid::Document
  
  belongs_to :group
  
  # Random unique invite token.
  field :token, type: String
  
  # Inviter user id.
  field :inviter_id
  
  # Invitee's user id.
  field :invitee_id, type: String
  
  # Invitee's e-mail.
  field :email, type: String
  
  # Invitee's privileges.
  field :privileges, type: String
  
  # State of invitation (1-4).
  field :state, type: Integer, default: 1
  
  field :request, type: String
  field :accept, type: String
  field :confirm, type: String
  field :conclude, type: String
  
  def inviter
    User.find(inviter_id)
  end
  
  def invitee
    invitee_id ? User.find(invitee_id) : nil
  end

end