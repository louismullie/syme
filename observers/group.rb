class GroupObserver < Mongoid::Observer

  def after_save(group)
    
    warn group.inspect
    warn group.ack_create
    
    if group.ack_create
      owner_id = group.users.first.id.to_s
    
      MagicBus::Publisher.send_to(
        owner_id, :create, :group, {})
    end

  end

end