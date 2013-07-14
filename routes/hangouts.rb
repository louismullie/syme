# 
# WARNING: EXPERIMENTAL
#
post '/hangouts', auth: [] do
  
  recipient_id = params[:recipient_id]
  
  hangout = @user.hangouts.create(
    sender_id: @user.id.to_s,
    recipient_id: recipient_id
  )
  
  @user.save!
  
  recipient = User.find(recipient_id)
  
  recipient.hangouts << hangout
  recipient.save!
  
  MagicBus::Publisher.send_to(recipient_id, :hangout, :create,
    { id: hangout.id.to_s, sender_name: @user.full_name })
  
  content_type :json
  
  { id: hangout.id.to_s }.to_json
  
end

put '/hangouts', auth: [] do
  
  hangout_id = params[:hangout_id]
  
  hangout = @user.hangouts.find(hangout_id)
  
  sender_id = hangout.sender_id  
  recipient_id = hangout.recipient_id

  sender = User.find(sender_id)
  recipient = User.find(recipient_id)
  
  if !(accept = params[:accept]).nil?
    
    if accept
      
       MagicBus::Publisher.send_to(sender_id,
        :hangout, :start,
        { id: hangout_id,
          partner_name: recipient.full_name })
      
       MagicBus::Publisher.send_to(recipient_id,
        :hangout, :start,
        { id: hangout_id,
          partner_name: sender.full_name })

    else
      
      MagicBus::Publisher.send_to(sender_id,
        :hangout, :decline,
        { id: hangout_id,
          recipient_name: recipient.full_name })
      
      hangout.destroy
      
    end
    
  end
  
  if finish = params[:finish]
    
    settings.clients[hangout_id].each do |id, clients|
      clients.each { |out| out.close }
    end
    
  end
  
  if data_type = params[:data]
    
    data = { type: data_type, data: params[:frame] }.to_json

    user_id = @user.id.to_s

    settings.clients[hangout_id].each do |id, clients|
      next if user_id == id
      clients.each do |out|
        out << "data: #{data}\n\n"
      end
    end if settings.clients[hangout_id]

  end
  
  hangout.save!
  
  empty_response
  
end


get '/hangouts/:hangout_id', auth: [] do |hangout_id|
  
  content_type 'text/event-stream'
  
  user_id = @user.id.to_s
  
  stream :keep_open do |out|
     
    settings.clients[hangout_id] ||= {}
    settings.clients[hangout_id][user_id] ||= []
    settings.clients[hangout_id][user_id] << out
    
    cleanup = lambda { out.close }
    
    out.callback(&cleanup)
    out.errback(&cleanup)

  end

end