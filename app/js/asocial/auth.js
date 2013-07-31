guard('auth', {

  login: function(email, password, remember, success, fail, hack) {
    
    //alert(remember);
    
    if (asocial.compat.inChromeExtension())
      chrome.storage.local.set({ 'remember':  remember });
    
    Backbone.Relational.store.reset();

    var srp = new SRPClient(email);

    var a = srp.srpRandom();
    var A = srp.calculateA(a);
    var _this = this;
    
    var params = $.param({ email: email, A: A.toString(16) });

    $.ajax(SERVER_URL + '/login/1', {
      
      type: 'POST', data: params,
      
      success: function (data) {
        
        if (data.B && data.salt) {
          
          var salt = data.salt;
          
          Crypto.deriveKeys(password, salt, function (keys) {
  
            srp.password = keys.key1;
            
            var B = new BigInteger(data.B, 16);
            var u = srp.calculateU(A, B);
            var Sc = srp.calculateS(B, salt, u, a);
            var K = srp.calcHashHex(Sc.toString(16));
            var M = srp.calculateM(email, salt, A, B, K);

            var params = $.param({
              M: M.toString(16),
              remember: remember
            });

            $('meta[name="_csrf"]').attr('content', data.csrf);

            $.post(SERVER_URL + '/login/2', params, function (data) {

               if (data.status == 'ok') {

                $('meta[name="_csrf"]').attr('content', data.csrf);

                var msg = 'Syme is currently in an early beta phase. ' +
                'This means that we might make small changes to our ' +
                'software that could imply loss of your data. You ' +
                'should always keep backups of any important information ' +
                'that you share in your groups.';
                
                
                asocial.helpers.showAlert(msg, {
                  
                  title: 'Beta warning', closable: false,
                
                  onsubmit: function () { success(keys.key2); return true; },
                  onhide: function () { success(keys.key2); return true; }
                    
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

            });
            
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

    CurrentSession = {};
    
    // Reset notification counter.
    if (asocial.compat.inChromeExtension()) {
      chrome.browserAction.setBadgeText({ text: '' });
    }

    $.ajax(SERVER_URL + '/sessions/xyz', {
      type: 'delete',
      success: callback
    });

  },

  disconnect: function () {

    asocial.auth.logout();

    // Force disconnection
    asocial.helpers.showAlert('You have been disconnected', {
      title: 'Disconnected',
      submit: 'Log in',
      closable: false,
      onhide: function(){
        Router.navigate('/');
      }
    });

  }

});