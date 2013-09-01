// CSRF token
$.ajaxSetup({
  
  beforeSend: function(xhr) {
    try {
      var token = Syme.CurrentSession.getCsrfToken();
      xhr.setRequestHeader('X_CSRF_TOKEN', token);
    } catch (error) {
      console.log('Session not initialized.');
    }
  }
  
});

$.encryptedAjax = function (url, options) {

  /*
  options.data = options.data || {};

  var data = JSON.stringify(options.data);

  var sessionKey = Syme.CurrentSession.getSessionKey();

  var encryptedData = sjcl.encrypt(sessionKey, data);

  options.data = { encrypted: true, data: encryptedData };

  var success = options.success || function () {};

  options.success = function (jsonResponse) {

    var txtResponse = JSON.stringify(jsonResponse);
    var decryptedResponse = sjcl.decrypt(sessionKey, txtResponse);
    success(JSON.parse(decryptedResponse));

  };*/

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
      decryptCounter = 0,
      startTime = new Date;

  // Show spinner
  NProgress.start();

  var numElements = $this.length;

  var incrementCounter = function(e){
  
    decryptCounter++;
    
    var progress = decryptCounter / numElements;
    NProgress.set(progress);
    
    // Call callback if all elements are done,
    // passing back $this and elapsed time
    if(decryptCounter == numElements){

      var endTime     = new Date,
          elapsedTime = endTime - startTime;
      
      NProgress.done();
      callback.call($this, elapsedTime);

    }
  };

  // Trigger decrypt, then wait for callback
  $this.trigger('decrypt', incrementCounter);

  return $this;

}