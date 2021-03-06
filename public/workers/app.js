importScripts('vendor.js');
importScripts('crypto.js');

self.onmessage = function(event) {
  
  var id = event.data['id'];
  var method = event.data['method'];
  var params = event.data['params'] || {};
  
  if (!id || !method || !params)
    throw 'Missing required parameters.'
  
  if (!Crypto[method])
    throw 'Method ' + method + ' does not exist.'
  
  var result = Crypto[method].apply(Crypto, params);
  
  postMessage({
    status: 'ok', id: id, result: result, debug: method
  });

};