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

// Usage: $().chainTrigger(handler, doneCb)
// or:    $().chainTrigger(handler, incrementCb, doneCb)
$.fn.chainTrigger = function(handler) {

  if ( arguments.length < 2 ) throw "Invalid number of arguments"

  var $this = this, originalLength = $this.length;

  var incrementCb = arguments.length == 2 ? $.noop : arguments[1],
      doneCb      = arguments.length == 2 ? arguments[1] : arguments[2];

  // Attribute unique ID
  $this.each(function(){ $(this).attr('data-unique-id', _.uniqueId()); });

  var doneElement = function($el) {

    // Remove unique ID from collection
    $this = $this.not('[data-unique-id="' + $el.data('unique-id') + '"]');

    // Call incrementCb(index, total)
    incrementCb( -($this.length - originalLength), originalLength );

    // If collection is empty, cleanup and doneCb()
    if( $this.length == 0 ) {
      $this.removeAttr('data-unique-id');
      doneCb();
    }

  };

  // Trigger each element (better for performance) passing them
  // the doneElement callback that they must execute when they are done.
  return $this.each(function(){
    if (!$(this).is('.post[data-encrypted="false"], .comment-box[data-encrypted="false"]')) debugger;
    $(this).trigger(handler, doneElement);
  });

}

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