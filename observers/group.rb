class GroupObserver < Mongoid::Observer

  def after_save(group)
    
    if group.ack_create && group.state == 0
      
      owner_id = group.users.first.id.to_s
      group.state = 1; group.save!
      
      MagicBus::Publisher.send_to(
        owner_id, :create, :group, {})
        
    end

  end
  
  def after_destroy(group)
    
    MagicBus::Publisher.broadcast(group, :delete,
      :group, { id: group.id.to_s} )
    
  end

end