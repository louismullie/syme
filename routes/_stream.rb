# EventSource connection for client applications.
get '/users/:user_id/stream', auth: [],
  provides: 'text/event-stream' do |user_id|

  user_id = @user.id.to_s
  subscriber = MagicBus::Subscriber
  
  stream :keep_open do |out|
    
    client_id = subscriber.subscribe(user_id, out)
    
    cleanup = lambda do
      subscriber.unsubscribe(user_id, client_id)
      out.close
    end
    
    out.callback(&cleanup)
    out.errback(&cleanup)

  end

end