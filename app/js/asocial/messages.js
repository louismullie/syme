guard('messages', {

  app: {
    
    outdated: "You seem to be using an "+
              "outdated version of Syme. Please update " +
              "your browser extension before continuing. <br> <br>" +
              "You can do this by entering <b>chrome://extensions/</b> " +
              "in your address bar, checking <b>\"Developer mode\"</b> and " +
              "cliking on <b>\"Update extensions now\"</b>.",
    
    maintenance: "Sorry, we're down for maintenance.  " +
                "Syme will be back up and running " +
                "as soon as possible. <br><br>Please "+
                " try again later.<br><br>",
  
    connection:  "Please check your Internet connection " +
                 "and try again."
  },
  
  auth: {
    
  },
  
  beta: {
    
    warning: 'Syme is currently in an early beta phase. ' +
             'This means that we might make small changes to our ' +
             'software that could imply loss of your data. You ' +
             'should always keep backups of any important information ' +
             'that you share in your groups.'
    
  },
  
  file: {
    
    maxSize: 'You can only upload files of up to 25 Mb for now.'
    
  },
  
  error: {
    
    fatal: 'An error has occured. We\'ve been notified ' +
           'and we\'ll address this as soon as possible.',
    
    postingFailed: 'Posting failed (PUT)!',
    
    invitationNotFound: 'This invitation does not exist anymore.'
  
  }
  
});