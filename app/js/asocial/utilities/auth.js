Auth = {
  
  register: function (email, password, fullName, remember, registrationError) {
    
    var user = new User();
    
    var srp = new SRPClient(email);

    user.save(

      { email: email, full_name: fullName },

      { success: function (model, response) {

        var verifierSalt = srp.randomHexSalt();
        
        Crypto.deriveKeys(password, verifierSalt, function (keys) {

          srp.password = keys.key1;
          
          var verifierBn = srp.calculateV(verifierSalt);
          var verifierHex = verifierBn.toString(16);
          
          CurrentSession.setCsrfToken(response.csrf);

          model.save({

            verifier: new Verifier({
              content: verifierHex,
              salt: verifierSalt
            })

            }, {

            success: function (model, response) {

              user.createKeyfile(keys.key2, function () {
                
                Auth.login(email, password, remember, function(derivedKey, sessionKey) {
                  
                    CurrentSession = new Session();

                    CurrentSession.initializeWithModelPasswordAndKey(
                      user, keys.key2, sessionKey, remember, function () {
                        Router.navigate('', { trigger: true, replace: true });
                 
                  });

                }, function () { alert('An error has occurred!'); }, true);
                
              });
            },

            error: Router.error

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

    if (Compatibility.inChromeExtension()) {
      chrome.storage.local.set({ 'remember':  remember });
      chrome.storage.local.set({ 'hasRegistered':  true });
    }

    Backbone.Relational.store.reset();

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

          Crypto.deriveKeys(password, salt, function (keys) {

            srp.password = keys.key1;

            var B = new BigInteger(data.B, 16);
            var u = srp.calculateU(A, B);
            var Sc = srp.calculateS(B, salt, u, a);

            var K = srp.calcHashHex(Sc.toString(16));
            var M = srp.calculateM(email, salt, A, B, K);

            var params = { M: M.toString(16), remember: remember };

            CurrentSession.setCsrfToken(data.csrf);

            $.ajax(SERVER_URL + '/users/current/sessions/' + sessionId, {

              type: 'PUT',
              data: params,

              success: function (data) {

               if (data.status == 'ok') {

                CurrentSession.setCsrfToken(data.csrf);

                var msg = Messages.beta.warning;

                var sessionKey = Sc.toString(16);
                
                Alert.show(msg, {
                  
                  title: 'Beta warning',
                  onhide: function () { success(keys.key2, sessionKey); return true; }

                });

              } else if (data.status == 'error') {

                // Non-deterministic Heisenbug with login
                if (hack) {

                  Backbone.Relational.store.reset();
                  CurrentSession = {};
                  Router.navigate('login');

                } else {

                  fail(data.reason);

                }

              } else {

                Router.error();

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

    var callback = callback || function () {};

    var userId = CurrentSession.getUserId();

       // Reset notification counter.
    if (Compatibility.inChromeExtension()) {
      chrome.browserAction.setBadgeText({ text: '' });
    }

    var url = SERVER_URL + '/users/' + userId + '/sessions/current';

    $.ajax(url, {
      type: 'DELETE',
      success: function () {
        CurrentSession = {};
        callback();
      }
    });

  },

  disconnect: function () {

    Auth.logout();

    // Force disconnection
    Alert.show(Messages.auth.disconnected, {
      title: 'Disconnected',
      submit: 'Log in',
      closable: false,
      onhide: function(){
        Router.navigate('/');
      }
    });

  }

};