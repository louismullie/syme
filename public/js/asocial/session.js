Session = function (success, failure) {

  // Default error for failure callback
  var failure = failure || Router.error;

  asocial.state.getState('user', function (logged_in) {

    // Error if user is not logged in.
    if(!logged_in) return failure();

    asocial.auth.authorizeForUser(function (authorized) {

      // Error if credentials decryption fails.
      if(!authorized) return failure();

      // Get the user's socket after state and authorization are done.
      asocial.socket.listen();

      // Decrypt the key pair.
      asocial.auth.getPasswordLocal(asocial.crypto.decryptKeypair);

      // Callback
      success();

    });

  });

};