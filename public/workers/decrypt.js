importScripts('vendor.js');

var decodeBase64 = function(s) {
    var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
    var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for(i=0;i<64;i++){e[A.charAt(i)]=i;}
    for(x=0;x<L;x++){
        c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
        while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
    }
    return r;
};

self.onmessage = function(event) {
  
  var id = event.data['id'];
  var chunk = event.data['chunk'];

  var worker = event.data['worker'],
      url = event.data['url'],
      csrf = event.data['csrf'],
      key = event.data['key'],
      token = event.data['token'],
      content = event.data['content'];
  
  var xhr = new XMLHttpRequest();
  
  var decrypt = function (key, cryptChunk) {
    
    var plainChunk = sjcl.decrypt(key, cryptChunk);
    
    var byteString = decodeBase64(decodeBase64(
      plainChunk.split(',')[1]));

    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    
    for (var i = 0; i < byteString.length; i++) {
       ia[i] = byteString.charCodeAt(i);
    }
    
    postMessage({
      id: id,
      data: ia,
      worker: worker,
      chunk: chunk,
      status: 'ok'
    });
    
  };
  
  if (!content) {
    
    xhr.addEventListener('load', function(event) {

      if (event.target.status != 200) {

        throw 'Server error (' + event.target.status + ')';

      } else {

        var cryptChunk = event.target.responseText;
        decrypt(key, cryptChunk)

      }

    });
    
    xhr.addEventListener(
      "error", function () { throw "Error!"; }, false);

    xhr.addEventListener(
      "abort", function () { throw "Abort!"; }, false);

    xhr.open('GET', url + '/' + chunk);
    xhr.setRequestHeader("X-REQUESTED-WITH", "XMLHttpRequest");
    xhr.setRequestHeader('X_CSRF_TOKEN', csrf);
    xhr.setRequestHeader('AccessToken', token);
    xhr.send('');
      
  } else {
    
    decrypt(key, content);
    
  }
  
};