get '/stream', auth: [], provides: 'text/event-stream' do

  user_id = @user.id.to_s
  
  stream :keep_open do |out|
    
    client_id = Subscriber.subscribe(user_id, out)
    
    cleanup = lambda do
      Subscriber.unsubscribe(user_id, client_id)
      out.close
    end
    
    out.callback(&cleanup)
    out.errback(&cleanup)

  end

end