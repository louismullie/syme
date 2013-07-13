importScripts('sjcl.js');
importScripts('ecc.js');

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

var buildPrivateKey = function (privJson) {

  var exponent = sjcl.bn.fromBits(privJson.exponent);

  var curve = "c" + privJson.curve;
  var privateKey = new sjcl.ecc.elGamal.secretKey(
      privJson.curve, sjcl.ecc.curves[curve], exponent);

  return privateKey;
};

var decrypt = function (privateKey, message) {

  var cipherMessage = JSON.parse(decodeBase64(message));

  var symKey = privateKey.unkem(cipherMessage.encrypted_key);
  var decryptedData = sjcl.decrypt(symKey, cipherMessage.ciphertext);

  return decryptedData;

};

var privateKey = null;

self.onmessage = function(event) {
  
  var id = event.data['id'];
  var message = event.data['msg'];
  
  var encKey = event.data['key'];
  
  if (!privateKey) {
    var privKeyJson = event.data['privKey'];
    var privKey = buildPrivateKey(privKeyJson);
  }
  
  var key = decrypt(privKey, encKey);
  
  var data = sjcl.decrypt(key, message);
  
  postMessage({ id: id, data: data, status: 'ok' });

};
