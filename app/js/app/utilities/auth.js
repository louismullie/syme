Syme.Auth = {
  
  register: function (email, password, fullName, remember, registrationErrorCb) {
    
    var _this = this, user = new User();
    
    user.save(

      { email: email, full_name: fullName },

      { 
        
        success: function (model, response) {
          
          Syme.CurrentSession.setCsrfToken(response.csrf);
          
          model.deriveKeys(password, 'pbkdf2', function (keys, salt) {
            
            var authenticationKey = keys.authenticationKey;
            
            model.createVerifier(email, authenticationKey, salt, 
              
              function () {
              
                model.createKeyfile(keys.keyfileKey, function () {
                
                  _this.firstLogin(email, password, 
                    keys.authenticationKey, remember);
    
                });
              
            })
            
          });

        } ,

        error: function (model, response) {

          var textResponse = response.responseText;
          var jsonResponse = JSON.parse(textResponse);
        
          registrationErrorCb(jsonResponse.error);
        
          return null;
        
        }
    
    });

  },

  firstLogin: function (email, password, authenticationKey, remember) {
    
    Syme.Auth.login(email, password, remember, function(derivedKey, csrfToken, sessionKey) {

        Syme.CurrentSession = new Syme.Session(csrfToken);

        Syme.CurrentSession.initializeWithModelPasswordAndKey(
          user, authenticationKey, sessionKey, remember, function () {
            Syme.Router.navigate('', { trigger: true, replace: true });
      });

    }, function () { alert('An error has occurred!'); }, true);
    
  },
  
  login: function(email, password, remember, success, fail) {

    if (Syme.Compatibility.inChromeExtension()) {
      chrome.storage.local.set({ 'remember':  remember });
      chrome.storage.local.set({ 'hasRegistered':  true });
    }
    
    var bits = 512, group = 2048, hash = 'sha-256', kdf = 'scrypt';
    
    Syme.Auth.tryLogin(email, password, remember, bits, group, hash, kdf,
      
      // Success
      function (derivedKey, csrfToken, sessionKey) {
        success(derivedKey, csrfToken, sessionKey);
      },
      
      // Failure
      function () {
        
        var bits = 512, group = 1024, hash = 'sha-1', kdf = 'pbkdf2';
        
        Syme.Auth.tryLogin(email, password, remember, bits, group, hash, kdf,
          
          // Success
          function (derivedKey, csrfToken, sessionKey) {
            success(derivedKey, csrfToken, sessionKey, true);
          },
          
          // Failure
          function () {
            
            var bits = 256, group = 1024, hash = 'sha-1', kdf = 'pbkdf2';
            
            Syme.Auth.tryLogin(email, password, remember, bits, group, hash, kdf,
              
              function (derivedKey, csrfToken, sessionKey) {
                success(derivedKey, csrfToken, sessionKey, true);
              }, fail
              
            );
            
          }
        )
      }
    );

    
  },
  
  tryLogin: function(email, password, remember, bits, group, hash, kdf, success, fail) {

    var srp = new SRPClient(email, password, group, hash);

    var a = srp.srpRandom();
    var A = srp.calculateA(a);
    
    var _this = this;

    var params = { email: email, A: A.toString(16) };

    $.ajax(SERVER_URL + '/users/current/sessions', {

      type: 'POST', data: params,

      success: function (data) {

        if (data.B && data.salt) {

          var salt = data.salt;
          var sessionId = data.session_id;
          
          Syme.Crypto.deriveKeys(password, salt, bits, kdf, function (keys) {
            
            var srp = new SRPClient(email, keys.key1, group, hash);

            var B = new BigInteger(data.B, 16);
            var u = srp.calculateU(A, B);
            var Sc = srp.calculateS(B, salt, u, a);

            var K = srp.calculateK(Sc);
            var M = srp.calculateM(A, B, K);

            var params = { M: M.toString(16), remember: remember };

            Syme.CurrentSession.setCsrfToken(data.csrf);

            $.ajax(SERVER_URL + '/users/current/sessions/' + sessionId, {

              type: 'PUT',
              data: params,

              success: function (data) {

               if (data.status == 'ok') {
                
                var derivedKey = keys.key2;
                var csrfToken = data.csrf;
                var sessionKey = Sc.toString(16);
                
                success(derivedKey, csrfToken, sessionKey);

              } else if (data.status == 'error') {

                 if (data.reason == 'confirm') {
                  Syme.Router.navigate('confirm');
                } else {
                  fail(data.reason);
                }

              } else {

                Syme.Router.error();

              }

            }});

          });

        } else if (data.status == 'error') {

          fail(data.reason);

        } else if (data.status == 401) {

          alert('Throttling!');

        }

    }, error: function (response) {

      if (response.status == 503) {
        fail('throttle');
      } else {
        fail('server');
      }
      
    }});

  },

  changePassword: function (password, changedPasswordCb) {
    
    var user = Syme.CurrentSession.getUser(),
        email = user.get('email');
    
    user.deriveKeys(password, 'scrypt', function (keys, salt) {
      
      var authenticationKey = keys.authenticationKey;
      
      user.createVerifier(email, authenticationKey, salt, 
        
        function () {
        
          var keyfileKey = keys.keyfileKey;
          
          user.updateKeyfileKey(keyfileKey, changedPasswordCb);
        
      })
      
    });
    
  },
 
  /*
   * Deletes the server-side session, then clears
   * the session on the client and passes execution
   * to the supplied callback function (if any).
   */
  logout: function (callback) {
    
    // Build the URL 
    var deleteSessionUrl = Syme.Url.fromCurrentUser('sessions', 'current');
  
    // Hide notifications badges.
    Notifications.hideBadge();

    // Log out by deleting the session on the server.
    $.ajax(deleteSessionUrl, {
      
      type: 'DELETE',
      
      // Callback when session deletion succeeds.
      success: function () {
        
        // Clear client session object.
        delete Syme.CurrentSession;
        Syme.CurrentSession = new Syme.Session();
        
        // Pass execution to success callback.
        callback();
        
      },
      
      // Callback when session deletion fails.
      error: function (response) {
        
        // We're already logged out.
        if (response.status == 403 || response.status == 401) {
          
          // Clear client session object.
          delete Syme.CurrentSession;
          Syme.CurrentSession = new Syme.Session();
          
          callback();
          
        // Otherwise show an error.
        } else {
          Syme.Error.ajaxError(response, 'delete', 'session');
        }
        
      }
      
    });

  },

  /*
   * Logs the client out, then shows a modal
   * indicating the client has been disconnected.
   */ 
  disconnect: function () {

    var modal = Syme.Messages.modals.alert.disconnect;
    
    Syme.Auth.logout(function () {
      
      Alert.show(modal.message, {
        
        title: modal.title,
        submit: modal.submit,
        
        closable: false,
        
        // Return to root page on hide.
        onhide: function(){
          Syme.Router.navigate('/');
        }
      });

    });

  }

};