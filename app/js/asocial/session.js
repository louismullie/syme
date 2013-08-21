Session = function () {

  var _this = this;
  
  this.user = null;
  this.userId = null;
  this.groups = null;
  this.groupId = null;
  this.password = null;
  this.passwordKey = null;
  this.remember = null;
  this.initialized = false;
  this.key = null;
  
  this.initialize = function (callback) {
    
    var _this = this;
    
    var version;
    
    // Get the application version.
    if (Syme.Compatibility.inChromeExtension()) {
      version = chrome.app.getDetails().version;
    } else {
      version = asocial.version;
    }
    
    try {
      
      $.ajax(SERVER_URL + '/users/current/sessions/current', {

        type: 'GET',

        data: { version: version },

        success: function (data) {
          
          _this.passwordKey = data.password_key;
          
          _this.fetchUser(data, function () {
            
            _this.retrieveCredentials(callback);
            
          });
          
        },

        error: function (response) {

          if (response.status == 401) return callback();

          if (response.status == 409) {

            var msg = Syme.Messages.app.outdated;

            Syme.Alert.show(msg, {
              closable: false, title: 'Please update Syme',
              onsubmit: function () { Router.reload(); } });

          } else if (response.status == 502) {

            var msg = Syme.Messages.app.maintenance;

            Syme.Alert.show(msg, {
              closable: false, title: 'Oops!',
              onsubmit: function () { Router.reload(); }
            });

          } else {

            var msg = Syme.Messages.app.connection;

            Syme.Alert.show(msg, {
              closable: false,
              title: 'No Internet connection',
              onsubmit: function () { Router.reload(); }
            });

          }

        }

      });
      
    } catch (e) {
      alert(e);
      callback();
    }

  };
  
  this.initializeWithPasswordAndKey = function (password, key, remember, callback) {
    
    this.password = password;
    this.key = key;
    this.remember = remember;
    this.initialize(callback);
    
  };
  
  this.initializeWithModelPasswordAndKey = function (user, password, key, remember, callback) {
    
    this.user = user;
    this.initializeWithPasswordAndKey(password, key, remember, callback);
    
  };
  
  this.fetchUser = function (data, callback) {
    
    this.passwordKey = data.password_key;
    
    $('meta[name="_csrf"]').attr('content', data.csrf);

    _this.groups = data.groups;
    _this.groupMembers = data.group_members;
    
    if (!data.user_id)
      throw 'Server did not send user ID';

    if (_this.user)
      return _this.startSession(callback);
      
    _this.user = new User();
    
    _this.user.fetch({

      data: { id: data.user_id },

      success: function () {
        
        _this.startSession(callback);
      },

      failure: function () {
        _this.endSession();
        callback();
    }});
    
  };
  
  this.startSession = function (callback) {
    
    var _this = this;
    
    var initializeKeyfile = function (password) {
      Crypto.initializeKeyfile(
        _this.user.get('id'), password,
        _this.user.get('keyfile'),
        callback
      );
    };
    
    if (!this.password || !this.key) {

      this.retrieveCredentials(function (credentials) {
        
        _this.initialized = true;
        
        initializeKeyfile(credentials.password);

      }, function () {
        
        callback();
        
      });
      
    } else {
      
      _this.initialized = true;
      
     _this.storeSession(function () {
       initializeKeyfile(_this.password);
     });
     
      
    }

  };
  

  this.endSession = function () {
    this.initialized = false;
  };

  this.getPasswordKey = function () {

    if (!this.passwordKey)
      throw 'Password key not initialized.'

    return this.passwordKey;

  };

  this.getUser = function () {
    if (!this.initialized) {
      throw 'Session not initialized.';
    } else {
      return this.user;
    }
  };

  this.getGroups = function () {
    if (!this.initialized) {
      throw 'Session not initialized.';
    } else {
      return this.groups || [];
    }
  };
  
  this.getUserId = function () {
    return this.getUser().get('id');
  };

  this.setGroupId = function (groupId) {

    this.groupId = groupId;

  };

  this.getGroupId = function () {

    if (!this.groupId)
      throw 'No group ID initialized.'

    return this.groupId;

  };
  
  /*
  this.setKey = function (key) {
    
    this.key = key;
    
  };
  
  this.getSessionKey = function () {
    
    if (!this.key)
      throw 'Key not initialized.';
  
    return this.key;
    
  };
  */
  
  this.getGroupMembers = function (groupId) {
    
    if (!this.groupMembers || !this.groupMembers[groupId]) {
      console.log('No group members initialized for this group.');
      // legacy -> change to throw
      return [];
    }
    
    return this.groupMembers[groupId];
    
  };
  
  this.setGroupMembers = function (groupId) {
    
    this.groupMembers = groupId;

    return null;
    
  };
  
  this.storeSession = function (callback) {
    
    var encryptedPassword = sjcl.encrypt(
      this.passwordKey, this.password);

    //var encryptedKey = sjcl.encrypt(
    //  this.passwordKey, this.key);
      
    if (Syme.Compatibility.inChromeExtension()) {

      chrome.storage.local.set({
        'credentials':  { 
          password: encryptedPassword
          //sessionKey: encryptedKey
        }
      }, callback);

    } else {
      
      sessionStorage.clear();

      sessionStorage.email = this.user.get('email');
      sessionStorage.password = encryptedPassword;
      //sessionStorage.sessionKey = encryptedKey;
      
      callback();
      
    }
    
  };

  this.passwordStoredIn = function (storage) {
    return typeof(storage.password) != 'undefined';
  };

  this.retrieveCredentials = function (success, error) {

    var _this = this;
    
    var error = error || function (){ Router.navigate('login') };
    
    var passwordKey = this.passwordKey;
    
    if (Syme.Compatibility.inChromeExtension()) {

      chrome.storage.local.get('credentials', function (cursor) {
        
        if (!cursor || !cursor.credentials) return error();
        
        var credentials = cursor.credentials;
        var encryptedPassword = credentials.password;
            //encryptedKey = credentials.sessionKey;
        
        if (!encryptedPassword) return error();
        
        try { 
          
          var password = sjcl.decrypt(passwordKey, encryptedPassword);
          //var key = sjcl.decrypt(passwordKey, encryptedKey);
          //_this.key = key;
          
          success({ password: password }); //, key: key });
          
        } catch (e) { error(); }
        
      });

    } else {
      
      var encryptedPassword = sessionStorage.password;
          //encryptedKey = sessionStorage.sessionKey;

     try {

        var password = sjcl.decrypt(passwordKey, encryptedPassword);
        //var key = sjcl.decrypt(passwordKey, encryptedKey);
        //_this.key = key;
        
        success({ password: password }); //, key: key });
        
     } catch (e) { error(); }
      
    }
    
  };
  
};