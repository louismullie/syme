def error(code, type_or_message, exception = nil)
  
  message = type_or_message.is_a?(Symbol) ?
    t('errors.' + type_or_message.to_s) :
    type_or_message
  
  logger.info %{
      User ID:    #{ @user ? @user.id : 'Not logged in.' }
      Timestamp:  #{ Time.now }
      Error:      #{ message }
      More info:  #{ exception ? exception.message : 'No info provided.'}
      Trace:      #{ exception ? exception.backtrace.join("\n") : 'No exception.' }
  }
  
  halt code, { error: message }.to_json

end