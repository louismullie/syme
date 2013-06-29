Session = function (user, callback) {

  var _this = this;
  this.initialized = false;
  
  if (!user) {
    
    $.ajax('http://localhost:5000/state/session', {
      
      type: 'GET',
      
      success: function (response) {
      
        var data = JSON.parse(response);
      
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