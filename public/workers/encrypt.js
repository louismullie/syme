importScripts('vendor.js');

var key = null;
var chunk = null;
var cryptChunk = null;

self.onmessage = function(event) {

  var data = event.data['data'];
  var pass = event.data['pass'];
  var worker = event.data['worker'];
  var id = event.data['id'];
  var csrf = event.data['csrf'];
  var token = event.data['token'];
  var url = event.data['url'];
  var chunks = event.data['chunks'];

  var key = data.key;
  var chunk = data.chunk;
  
  var reader = new FileReaderSync();
  var chunk = reader.readAsDataURL(chunk);
  
  var encrypted = sjcl.encrypt(key, chunk);
  var data = new Blob([encrypted]);

  var fd = new FormData();

  if (pass * 4 + worker + 1 == chunks)
    fd.append('last', 'true');
  
  fd.append("id", id);
  fd.append("chunk", pass * 4 + worker);
  fd.append("data", data);

  var xhr = new XMLHttpRequest();

  xhr.addEventListener("error", function(evt) {
    throw "Client error on upload.";
  }, false);

  xhr.addEventListener("abort", function(evt) {
    throw "Upload aborted.";
  }, false);

  xhr.addEventListener("load", function(evt) {

    postMessage({
      status: 'ok', id: id,
      pass: pass, worker: worker
    });

  });
  
  xhr.open('POST', url);
  
  xhr.setRequestHeader('X_CSRF_TOKEN', csrf);
  xhr.setRequestHeader('AccessToken', token);
  xhr.send(fd);

};