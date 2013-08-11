// CSRF token
$.ajaxSetup({
  beforeSend: function(xhr) {
    var token = $('meta[name="_csrf"]').attr('content');
    xhr.setRequestHeader('X_CSRF_TOKEN', token);
  }
});

// 1. Guard this.
// 2. CSRF?
// 4. Backbone
// 5. Downloads/uploads
// 6. Encrypt erros?
$.encryptedAjax = function (url, options) {
  
  options.data = options.data || {};
  
  var data = JSON.stringify(options.data);
  
  var sessionKey = CurrentSession.getSessionKey();
  
  var encryptedData = sjcl.encrypt(sessionKey, data);
  
  options.data = { encrypted: true, data: encryptedData };
  
  var success = options.success || function () {};
  
  options.success = function (jsonResponse) {

    var txtResponse = JSON.stringify(jsonResponse);
    var decryptedResponse = sjcl.decrypt(sessionKey, txtResponse);
    success(JSON.parse(decryptedResponse));
    
  };
  
  $.ajax(url, options);
  
};

// Creating custom :external selector - remove?
$.expr[':'].external = function(obj){
  return !obj.href.match(/^mailto\:/) &&
  (obj.hostname != location.hostname);
};

$.fn.batchDecrypt = function(callback){

  // Initialize variables
  var $this     = this,
      callback  = callback || function(){},
      decryptCounter   = 0,
      startTime = new Date;

  var incrementCounter = function(e){
    
    decryptCounter++;

    // Call callback if all elements are done,
    // passing back $this and elapsed time
    if(decryptCounter == $this.length){

      var endTime     = new Date,
          elapsedTime = endTime - startTime;

      callback.call($this, elapsedTime);

    }
  };

  // Trigger decrypt, then wait for callback
  $this.trigger('decrypt', incrementCounter);
  
  return $this;

}