Syme.Auth = {
  
  register: function (email, password, fullName, remember, registrationError) {
    
    var user = new User();
    
    var srp = new SRPClient(email);

    user.save(

      { email: email, full_name: fullName },

      { success: function (model, response) {
        
        // Set CSRF token for second step of authentication.
        Syme.CurrentSession.setCsrfToken(response.csrf);
        
        // Generate a salt to derive keys from the password.
        var credentialSalt = srp.randomHexSalt();
        
        // Derive authentication and keyfile encryption keys from password.
        Syme.Crypto.deriveKeys(password, credentialSalt, function (keys) {

          srp.password = keys.key1;
          
          // Calculate the SRP verifier and convert to hex.
          var verifierBn = srp.calculateV(credentialSalt);
          
          // Convert the SRP verifier to hexadecimal form.
          var verifierHex = verifierBn.toString(16);

          model.save(
            
            { verifier: { content: verifierHex, salt: credentialSalt } },
            
            { success: function (model, response) {

              user.createKeyfile(keys.key2, function () {
                
                Syme.Auth.login(email, password, remember, function(derivedKey, sessionKey) {
                  
                    Syme.CurrentSession = new Syme.Session();

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

    var srp = new SRPClient(email);

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

          Syme.Crypto.deriveKeys(password, salt, function (keys) {

            srp.password = keys.key1;

            var B = new BigInteger(data.B, 16);
            var u = srp.calculateU(A, B);
            var Sc = srp.calculateS(B, salt, u, a);

            var K = srp.calcHashHex(Sc.toString(16));
            var M = srp.calculateM(email, salt, A, B, K);

            var params = { M: M.toString(16), remember: remember };

            Syme.CurrentSession.setCsrfToken(data.csrf);

            $.ajax(SERVER_URL + '/users/current/sessions/' + sessionId, {

              type: 'PUT',
              data: params,

              success: function (data) {

               if (data.status == 'ok') {

                Syme.CurrentSession.setCsrfToken(data.csrf);

                var msg = Syme.Messages.beta.warning;

                var sessionKey = Sc.toString(16);
                
                Alert.show(msg, {
                  
                  title: 'Beta warning',
                  onhide: function () { success(keys.key2, sessionKey); return true; }

                });

              } else if (data.status == 'error') {

                // Non-deterministic Heisenbug with login
                if (hack) {

                  Syme.CurrentSession = {};
                  Syme.Router.navigate('login');

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

        } else if (xhr.status == 401) {

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

  logout: function (callback) {
    
    var userId = Syme.CurrentSession.getUserId();

    Notifications.hideBadge();

    var url = SERVER_URL + '/users/' + 
              userId + '/sessions/current';

    $.ajax(url, {
      
      type: 'DELETE',
      
      success: function () {
        Syme.CurrentSession = {};
        callback();
      }
      
    });

  },

  disconnect: function () {

    Syme.Auth.logout(function () {
      
      // Force disconnection
      Alert.show(Syme.Messages.auth.disconnected, {
        title: 'Disconnected',
        submit: 'Log in',
        closable: false,
        onhide: function(){
          Syme.Router.navigate('/');
        }
      });

    });

  }

};