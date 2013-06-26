importScripts('sjcl.js');

self.onmessage = function(event) {
  
  var id = event.data['id'];
  var message = event.data['msg'];
  var key = event.data['key'];
  
  var data = sjcl.decrypt(key, message);
  
  postMessage({ id: id, data: data, status: 'ok' });

};