Syme.Auth = {
  
  register: function (email, password, fullName, remember, registrationError) {
    
    var user = new User();
    
    var srp = new SRPClient(email, password, 2048); //, 2048);

    user.save(

      { email: email, full_name: fullName },

      { success: function (model, response) {
        
        // Set CSRF token for second step of authentication.
        Syme.CurrentSession.setCsrfToken(response.csrf);
        
        // Generate a salt to derive keys from the password.
        var credentialSalt = srp.randomHexSalt();
        
        // Derive authentication and keyfile encryption keys from password.
        Syme.Crypto.deriveKeys(password, credentialSalt, 512, function (keys) {

          srp.password = keys.key1;
          
          // Calculate the SRP verifier and convert to hex.
          var verifierBn = srp.calculateV(credentialSalt);
          
          // Convert the SRP verifier to hexadecimal form.
          var verifierHex = verifierBn.toString(16);

          model.save(
            
            { verifier: { content: verifierHex, salt: credentialSalt } },
            
            { success: function (model, response) {

              user.createKeyfile(keys.key2, function () {
                
                Syme.Auth.login(email, password, remember, function(derivedKey, csrfToken, sessionKey) {
                  
                    Syme.CurrentSession = new Syme.Session(csrfToken);

                    Syme.CurrentSession.initializeWithModelPasswordAndKey(
                      user, keys.key2, sessionKey, remember, function () {
                        Syme.Router.navigate('', { trigger: true, replace: true });
                 
                  });

                }, function () { alert('An error has occurred!'); }, true);
                
              });
            },

            error: Syme.Router.error

          });
        });

      },

      error: function (model, response) {

        var textResponse = response.responseText;
        var jsonResponse = JSON.parse(textResponse);
        
        registrationError(jsonResponse.error);
        
        return null;
        
      }
    
    });

  },
  
  login: function(email, password, remember, success, fail, hack) {

    if (Syme.Compatibility.inChromeExtension()) {
      chrome.storage.local.set({ 'remember':  remember });
      chrome.storage.local.set({ 'hasRegistered':  true });
    }

    var srp = new SRPClient(email, null, 2048);

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

          var bits = data.compatibility ? 256 : 512;
          var group = data.compatibility ? 1024 : 1024; // 2048
          
          Syme.Crypto.deriveKeys(password, salt, bits, function (keys) {
            
            var srp = new SRPClient(email, keys.key1, 2048);

            var B = new BigInteger(data.B, 16);
            var u = srp.calculateU(A, B);
            var Sc = srp.calculateS(B, salt, u, a);

            var K = calcSHA1Hex(Sc.toString(16));
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

                // Non-deterministic Heisenbug with login
                 if (data.reason == 'confirm') {
                  Syme.Router.navigate('confirm');
                 } else if (hack) {

                  Syme.Auth.logout(function () {
                    Syme.Router.navigate('login');
                  });

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