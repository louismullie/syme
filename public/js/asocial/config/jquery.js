// CSRF token
$.ajaxSetup({
  beforeSend: function(xhr) {

    var token = $('meta[name="_csrf"]').attr('content');
    xhr.setRequestHeader('X_CSRF_TOKEN', token);

  }
});

// Creating custom :external selector
$.expr[':'].external = function(obj){
  return !obj.href.match(/^mailto\:/) &&
  (obj.hostname != location.hostname);
};

$.fn.batchDecrypt = function(callback){

  // Initialize variables
  var $this     = this,
      callback  = callback || function(){},
      counter   = 0,
      startTime = new Date;

  // Asynchronous callback
  var incrementCounter = function(e){
    // Iterate queue
    counter++;

    // Call callback if all elements are done,
    // passing back $this and elapsed time
    if(counter == $this.length){

      var endTime     = new Date,
          elapsedTime = endTime - startTime;

      callback.call($this, elapsedTime);

    }
  };

  // Trigger decrypt, then wait for callback
  $this.trigger('decrypt', incrementCounter);

  return $this;

}