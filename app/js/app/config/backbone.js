$(document).ready(function () {
  
  // Store the native, default sync method, we'll wrap this.
  Backbone._nativeSync = Backbone.sync;

  // Ever so gingerly wrap the native sync
  // in a method that combines options
  Backbone.sync = function( method, model, options) {

    if (Syme.CurrentSession.initialized) {
      
      var options = options || {};
      options.headers = options.headers || {};

      options.headers["AccessToken"] = 
        options.headers["AccessToken"] ||
        JSON.stringify({
          user_id: Syme.CurrentSession.getUserId(),
          access_token: Syme.CurrentSession.getAccessToken()
        });
      
    }
      
    Backbone._nativeSync( method, model, options);

  };
  
})