guard('auth', {

  login: function(email, password, remember, success, fail) {

    var srp = new SRPClient(email, password);

    var a = srp.srpRandom();
    var A = srp.calculateA(a);

    var params = $.param({ email: email, A: A.toString(16) });

    $.post('http://localhost:5000/login/1', params, function (data) {

      if (data.B && data.salt) {

        var salt = data.salt;
        var B = new BigInteger(data.B, 16);
        var u = srp.calculateU(A, B);
        var Sc = srp.calculateS(B, salt, u, a);
        var M = srp.calculateM(email, salt, A, B, Sc);

        var params = $.param({ M: M.toString(16) });

        $.post('http://localhost:5000/login/2', params, function (data) {

          if (data.status == 'ok') {

            $('meta[name="_csrf"]').attr('content', data.csrf);
            success();

            
          } else if (data.status == 'error') {

            console.log('State ERROR', data);
            fail(data.reason);

          } else {

            fail('server');

          }

        });

        var storage = remember ? localStorage: sessionStorage;

        sessionStorage.clear(); localStorage.clear();

        storage.email = email;
        var password_key = data.B.toString();
        CurrentSession.setPasswordKey(password_key);

        storage.password =
        sjcl.encrypt(password_key, password);

        window.password =
        sjcl.encrypt(password_key, password);

        if (asocial.compat.inChromeExtension()) {
          
          chrome.storage.local.set({
            'password':  sjcl.encrypt(password_key, password)
          }, function () {
            console.log('Stored pass');
          });

        }
        
      } else if (data.status == 'error') {

        fail(data.reason);

      } else {

        fail('server');

      }


    });

  },

  logout: function (callback) {

    var callback = callback || function () {};

    asocial_state = {};

    $.ajax('http://localhost:5000/sessions/xyz', {
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
        window.location = '/';
      }
    });

  },
  
  passwordStoredIn: function (storage) {
    return typeof(storage.password) != 'undefined';
  },

  getPasswordLocal: function (callback) {

    var encryptedPassword;

    if (this.passwordStoredIn(window)) {
      encryptedPassword = window.password;
    } else if (this.passwordStoredIn(localStorage)) {
      encryptedPassword = localStorage.password;
    } else if (this.passwordStoredIn(sessionStorage)) {
      encryptedPassword = sessionStorage.password;
    }
    
    var passwordKey = CurrentSession.getPasswordKey();
    
    if (!encryptedPassword) {
      if (asocial.compat.inChromeExtension()) {
        
        chrome.storage.local.get('password', function (obj) {
          if (obj.password) {
            var password = sjcl.decrypt(passwordKey, obj.password);
            callback(password);
          } else {
            callback(false);
          }
        });
        
      } else {
        callback(false);
      }
    } else {
      var password = sjcl.decrypt(passwordKey, encryptedPassword);
      callback(password);
    }

  }
  
});