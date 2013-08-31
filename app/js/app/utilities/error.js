Syme.Error = {
  
  // Callback for errors occuring during AJAX requests.
  ajaxError: function (response, operation, model) {
    
    // Wrap the reload function to make sure it's called correctly.
    var reloadPage = function () { Syme.Router.reload(); }
    
    // If 404, indicate that the model doesn't exist.
    if (response.status == 404) {
      
      var msg = 'This ' + model + ' does not exist anymore.';
      
    // For any other error, show a generic error message.
    } else {
      
      var msg = 'Could not ' + operation + ' ' + model + '.';
      
    }
    
    // Show an alert with the message, reload
    // when the modal is hidden by the user.
    Alert.show(msg, { onhide:  reloadPage });
    
  }
  
};