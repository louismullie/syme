

get '/users/:user_id/invitations', auth: [] do |user_id|

  if user_id != @user.id.to_s
    error 403, 'unauthorized'
  end
  
  result = {}
  
  @user.groups.each do |group|
  
    invitations = {}
  
    group.invitations.each do |invitation|
    
      # Current user is the invitee
      if invitation.state == 3 &&
         invitation.invitee_id == @user.id.to_s &&
         !invitation.ack_integrate
    
        invitations[:integrate] = {
          id: invitation.id.to_s,
          group_id: invitation.group.id.to_s,
          request: invitation.integrate
        }
      
      # Invite has been accepted
      elsif invitation.state > 2  &&
      
        # Current user is not inviter
        invitation.inviter_id != @user.id.to_s &&  
        # Current user is not invitee
        invitation.invitee_id != @user.id.to_s && 
        invitation.distribute && 
        !invitation.ack_distribute.include?(@user.id.to_s)

        invitations[:distribute] ||= []
      
        invitations[:distribute] << {
          id: invitation.id.to_s,
          request: invitation.distribute
        }
        
      end
    
    end
  
    invitations[:members] = {}
  
    @user.groups.each do |group|
    
      invitations[:members][group.id.to_s] =
      group.users
        .reject { |user| user.id == @user.id }
        .map { |user| user.full_name }
      
    end
    
    result[group.id.to_s] = invitations
    
  end
  
  result.to_json
  
end