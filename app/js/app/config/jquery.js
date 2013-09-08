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