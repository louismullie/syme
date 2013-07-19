# Main notification endpoint for client apps.
get '/users/:user_id/stream', auth: [] do |user_id|

  # Set content type for EventSource.
  content_type 'text/event-stream'
  
  # Verify user is authorized to subscribe.
  if user_id != @user.id.to_s
    error 403, 'unauthorized'
  end
  
  subscriber = MagicBus::Subscriber
  
  # Track the user's subscription to the stream.
  track @user, 'User subscribed to stream'
  
  # Stream the response to the client application.
  stream :keep_open do |out|
    
    # Subscribe the client to the message queue.
    client_id = subscriber.subscribe(user_id, out)
    
    # Unsubscribe the client and close the stream.
    cleanup = lambda do
      track @user, 'User was unsubscribed from stream'
      subscriber.unsubscribe(user_id, client_id)
      out.close
    end
    
    # Cleanup on source close or source error.
    out.callback(&cleanup); out.errback(&cleanup)

  end

end