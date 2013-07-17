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
  
  this.initialize = function (callback) {
    
    var _this = this;
    
    var version;
    
    if (asocial.compat.inChromeExtension()) {
      version = chrome.app.getDetails().version;
    } else {
      version = '0.0.2';
    }
    
    $.ajax(SERVER_URL + '/state/session', {

      type: 'GET',
      
      data: { version: version },

      success: function (data) {
        _this.passwordKey = data.password_key;
        _this.fetchUser(data, callback);
      },
      
      error: function (response) {
        
        if (response.status == 401) callback();
        
        if (response.status == 409) {
          
          var msg = "Hi there! We've noticed you're using an "+
          "outdated version of Syme. Please update " +
          "your browser extension before continuing. <br> <br>" +
          "You can do this by entering <b>chrome://extensions/</b> " +
          "in your address bar and cliking on <b>\"Update "+
          "extensions now\"</b>.";
          
          asocial.helpers.showAlert(msg, {
            closable: false,
            title: 'Please update Syme'
          });
          
        } else if (response.status == 503) {
          
          var msg = "We're down for maintenance. Please try again later.";
          asocial.helpers.showAlert(msg, { closable: false,
            closable: false,
            title: 'Down for maintenance'
          });
          
        } else {
          
          var msg = "Our servers are not responding in the usual way. " +
                    "Please try again later.";
          
          asocial.helpers.showAlert(msg, {
            closable: false,
            title: 'Oops!'
          });
          
        }
        
      }

    });

  };
  
  this.initializeWithPassword = function (password, remember, callback) {
    
    this.password = password;
    this.remember = remember;
    this.initialize(callback);
    
  };
  
  this.initializeWithModelAndPassword = function (user, password, remember, callback) {
    
    this.user = user;
    this.initializeWithPassword(password, remember, callback);
    
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
        _this.user.get('_id'), password,
        _this.user.get('keyfile'),
        callback
      );
    };

    if (!this.password) {
      
      this.retrievePassword(function (password) {
        
        _this.initialized = true;
        
        initializeKeyfile(password);

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
    return this.getUser().get('_id');
  };

  this.setGroupId = function (groupId) {

    this.groupId = groupId;

  };

  this.getGroupId = function () {

    if (!this.groupId)
      throw 'No group ID initialized.'

    return this.groupId;

  };
  
  this.getGroupMembers = function (groupId) {
    
    if (!this.groupMembers || !this.groupMembers[groupId])
      throw 'No group members initialized for this group.'
    
    return this.groupMembers[groupId];
    
  };
  
  this.setGroupMembers = function (groupId) {
    
    this.groupMembers = groupId;

    return null;
    
  };
  
  this.storeSession = function (callback) {
    
    var encryptedPassword = sjcl.encrypt(
      this.passwordKey, this.password);

    if (asocial.compat.inChromeExtension()) {

      chrome.storage.local.set({
        'password':  encryptedPassword
      }, callback);

    } else {
      
      sessionStorage.clear();

      sessionStorage.email = this.user.get('email');
      sessionStorage.password = encryptedPassword;
      
      callback();
      
    }
    
  };

  this.passwordStoredIn = function (storage) {
    return typeof(storage.password) != 'undefined';
  };

  this.retrievePassword = function (success, error) {

    var _this = this;
    
    var passwordKey = this.passwordKey;
    
    if (asocial.compat.inChromeExtension()) {

      chrome.storage.local.get('password', function (obj) {
        
        var encryptedPassword = obj.password;
        
        if (!encryptedPassword) return error();
        
        try { 
          var password = sjcl.decrypt(passwordKey, obj.password);
          success(password);
        } catch (e) { error(); }
        
      });

    } else {
      
      var encryptedPassword = sessionStorage.password;

      try { 
        
        var password = sjcl.decrypt(passwordKey, encryptedPassword);
        
        success(password);
        
      } catch (e) { error(); }
      
    }
    
  };
  
};