guard('auth', {

  keygen: function(user_id, password, success) {

    // Generate a random salt for the password hash.
    var salt = asocial.crypto.generateRandomHexSalt();

    // Derive key form the user's password using the hex salt.
    var key = asocial.crypto.calculateHash(password, salt);

    // Generate an RSA keypair, convert to JSON and encrypt with key.
    var keypair = asocial.crypto.generateEncryptedKeyPair(key);

    // Build a request for the server to create a keypair for the user.
    var data = { user_id: user_id, keypair: keypair, keypair_salt: salt };

    // Register the new keypair with the server and callback.
    $.post('http://localhost:5000/register/3', $.param(data), success);

  },

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

            asocial.state.getState('system', function () {
              success(data);
            }, { force: true });

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

        storage.password =
        sjcl.encrypt(password_key, password);

        window.password =
        sjcl.encrypt(password_key, password);

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

  authorize: function (fn, callback, password) {

    var _this = this;
    var authorized;

    if (password) {
      callback(fn(password));
    } else {
      _this.getPasswordLocal(function (password) {
        callback(fn(password));
      });
    }

  },

  authorizeForUser: function (callback, password) {

    if (this.isAuthorizedForUser()) {
      callback(true);
    } else {
      var fn = asocial.crypto.decryptKeypair;
      this.authorize(fn, callback, password);
    }

  },

  authorizeForGroup: function (callback, password) {

    if (this.isAuthorizedForGroup()) {
      callback(true);
    } else {
      var fn = asocial.crypto.decryptKeylist;
      this.authorize(fn, callback, password);
    }

  },


  passwordStoredIn: function (storage) {
    return typeof(storage.password) != 'undefined';
  },

  isAuthorizedForUser: function () {
    return typeof(asocial_private_key) !== "undefined";
  },

  isAuthorizedForGroup: function () {
    return typeof(asocial_keylist) !== "undefined";
  },

  getPasswordLocal: function (callback) {

    var encryptedPassword;

    if (this.passwordStoredIn(window)) {
      encryptedPassword = window.password;
    } else if (this.passwordStoredIn(localStorage)) {
      encryptedPassword = localStorage.password;
    } else if (this.passwordStoredIn(sessionStorage)) {
      encryptedPassword = sessionStorage.password;
    } else {
      return false;
    }

    var passwordKey = asocial.state.user.password_key;

    var password = sjcl.decrypt(passwordKey, encryptedPassword);

    callback(password);
    return true;

  }

});