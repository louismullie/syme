$.fn.chainTrigger = function(handler, incrementCb, doneCb) {

  var $this = this, originalLength = $this.length;

  // Attribute unique ID
  $this.each(function(){ $(this).attr('data-unique-id', _.uniqueId()); });

  var doneElement = function($el) {

    // Remove unique ID from collection
    $this = $this.not('[data-unique-id="' + $el.attr('data-unique-id') + '"]');

    // Call incrementCb(index, total)
    incrementCb( -($this.length - originalLength), originalLength );

    // If collection is empty, cleanup and doneCb()
    if( $this.length == 0 ) doneCb();

  };

  // Trigger each element (better for performance) passing them
  // the doneElement callback that they must execute when they are done.
  return $this.each(function(){ $(this).trigger(handler, doneElement); });

}

// CSRF token
$.ajaxSetup({

  beforeSend: function(xhr) {
    try {
      var token = Syme.CurrentSession.getCsrfToken();
      xhr.setRequestHeader('X_CSRF_TOKEN', token);
      xhr.setRequestHeader('AccessToken', JSON.stringify({
        user_id: Syme.CurrentSession.getUserId(),
        access_token: Syme.CurrentSession.getAccessToken()
      }));
    } catch (error) {
      console.log('Session not initialized.');
      console.trace();
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