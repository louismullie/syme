class Invite

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
  
  # Transfer old group content.
  field :keys, type: String
  
  # Step 2.
  field :k_P
  field :k_sA
  field :PA_k
  
  # Step 3.
  field :PPA_k
  
  def inviter
    User.find(inviter_id)
  end
  
  def invitee
    invitee_id ? User.find(invitee_id) : nil
  end
  
end