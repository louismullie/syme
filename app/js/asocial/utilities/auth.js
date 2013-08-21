Syme.Auth = {

  login: function(email, password, remember, success, fail, hack) {

    if (Syme.Compatibility.inChromeExtension())
      chrome.storage.local.set({ 'remember':  remember });

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

            $('meta[name="_csrf"]').attr('content', data.csrf);

            $.ajax(SERVER_URL + '/users/current/sessions/' + sessionId, {

              type: 'PUT',
              data: params,

              success: function (data) {

               if (data.status == 'ok') {

                $('meta[name="_csrf"]').attr('content', data.csrf);

                var msg = Syme.Messages.beta.warning;

                var sessionKey = Sc.toString(16);
                
                Syme.Alert.show(msg, {
                  
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
    if (Syme.Compatibility.inChromeExtension()) {
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

    Syme.Auth.logout();

    // Force disconnection
    Syme.Alert.show(Syme.Messages.auth.disconnected, {
      title: 'Disconnected',
      submit: 'Log in',
      closable: false,
      onhide: function(){
        Router.navigate('/');
      }
    });

  }

};