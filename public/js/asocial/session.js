Session = function (user, callback) {

  var _this = this;
  this.initialized = false;
  this.passwordKey = null;
  
  if (!user) {
    
    $.ajax('http://localhost:5000/state/session', {
      
      type: 'GET',
      
      success: function (response) {
      
        var data = JSON.parse(response);
      
        var password_key = data.password_key;
        _this.setPasswordKey(data.password_key);
        
        if (!data.user_id)
          return callback();
      
        _this.user = new User();

        _this.user.fetch({
        
          data: { id: data.user_id },
        
          success: function () {
            _this.startSession();
            callback(); return null
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
    
    this.user = user;
    asocial.socket.listen();
    this.initialized = true;
    
  }
  
  this.startSession = function () {
    this.initialized = true;
    asocial.socket.listen();
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

};