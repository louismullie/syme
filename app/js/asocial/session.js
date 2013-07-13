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
    
    $.ajax(SERVER_URL + '/state/session', {

      type: 'GET',

      success: function (data) {
        _this.passwordKey = data.password_key;
        _this.fetchUser(data, callback);
      },
      error: callback

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
    
    this.passworKey = data.password_key;
    
    $('meta[name="_csrf"]').attr('content', data.csrf);

    _this.groups = data.groups;
    
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

    if (!groupId)
      throw 'Missing required parameter.'

    this.groupId = groupId;

  };

  this.getGroupId = function () {

    if (!this.groupId)
      throw 'No group ID initialized.'

    return this.groupId;

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