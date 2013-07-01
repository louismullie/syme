Session = function (user, callback) {

  var _this = this;
  this.initialized = false;
  this.passwordKey = null;
  
  this.startSession = function (callback) {
    
    this.initialized = true;
    asocial.socket.listen();
    
    asocial.auth.getPasswordLocal(function (p) {
      
      Crypto.initializeKeyfile(
        _this.user.get('_id'), p,
        _this.user.get('keyfile'),
        callback
      );
    });
    
  };
  
  this.endSession = function () {
    this.initialized = false;
  };
  
  this.getPasswordKey = function () {
    
    if (!this.passwordKey)
      throw 'Password key not initialized.'
    
    return this.passwordKey;
    
  };
  
  this.setPasswordKey = function (passwordKey) {
    this.passwordKey = passwordKey;
  };
  
  this.getUser = function () {
    if (!this.initialized) {
      throw 'Session not initialized.';
    } else {
      return this.user;
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

  if (!user) {
    
    $.ajax('http://localhost:5000/state/session', {
      
      type: 'GET',
      
      success: function (response) {
        
        var data = response;
      
        var password_key = data.password_key;
        _this.setPasswordKey(data.password_key);
        
        if (!data.user_id)
          return callback();
      
        _this.user = new User();

        _this.user.fetch({
        
          data: { id: data.user_id },
        
          success: function () {
            console.log
            _this.startSession(callback);
            return null
          },
        
          failure: function () {
            _this.endSession();
            callback(); return null;
          }
        
        });

      },
      
      error: function () {
        callback();
      }
      
    });
    
  } else {
    
    _this.user = user;
    _this.startSession(callback);
    
  };

};