importScripts('keyfile.js');
importScripts('formData.js');

Crypto = {
  
  /* App */
  
  initializeKeyfile: function (userId, password, encKeyfile) {
    
    this.keyfile = new Keyfile(userId, password, encKeyfile);
    return null;
    
  },
  
  createKeylist: function (keylistId) {
    
    var keyfile = this.getKeyfile();
    return keyfile.createKeylist(keylistId);
    
  },
  
  deleteKeylist: function (keylistId) {
    
    var keyfile = this.getKeyfile();
    
    keyfile.deleteKeylist(keylistId);
    
    return null;
    
  },
  
  getEncryptedKeyfile: function () {
    
    var keyfile = this.getKeyfile();
    return keyfile.getEncryptedKeyfile();
    
  },
  
  getSerializedKeyfile: function () {
    return this.getKeyfile().serialize();
  },
  
  addKeypairs: function (keylistId, userId, keypairsJson) {
    
    var keyfile = this.getKeyfile();
    return keyfile.addKeypairs(keylistId, userId, keypairsJson);
    
  },
  
  createInviteRequest: function(keylistId, userAlias) {
    
    var keyfile = this.getKeyfile();
    return keyfile.createInviteRequest(keylistId, userAlias);
    
  },
  
  acceptInviteRequest: function (inviteRequest) {
    
    var keyfile = this.getKeyfile();
    return keyfile.acceptInviteRequest(inviteRequest);
    
  },
  
  confirmInviteRequest: function (inviteRequest) {
    
    var keyfile = this.getKeyfile();
    return keyfile.confirmInviteRequest(inviteRequest);
    
  },
  
  completeInviteRequest: function (inviteRequest) {
    
    var keyfile = this.getKeyfile();
    
    return keyfile.completeInviteRequest(inviteRequest);
    
  },
  
  addUserRequest: function (addUserRequest) {
    
    var keyfile = this.getKeyfile();

    return keyfile.addUserRequest(addUserRequest);
      
  },
  
  getKeyfile: function () {
    
    if (!this.keyfile)
      throw 'Keyfile not initialized.';
    
    return this.keyfile;
    
  },
  
  /* // App */
  
  generateRandomHex: function (bytes) {

    // Generate some random words.
    var randomWords = sjcl.random.randomWords(bytes / 8, 0);
    
    // Convert the bytes to hexadecimal format.
    return sjcl.codec.hex.fromBits(randomWords);

  },
  
  deriveKey: function (data, salt) {
    
    // Generate a random hexadecimal salt.
    var salt = this.generateRandomHex(256);

    // Perform PBKDF2 with 10,000 iterations of SHA256.
    var key = sjcl.misc.pbkdf2(data, salt, 10000, 256);
    
    // Return a JSON representation of the key and salt.
    return { key: key, salt: salt };
    
  },
  
  diffieHellman: function (privateKey, publicKey) {
    
    // Calculate the Diffie-Hellman shared key.
    return privateKey.dh(publicKey);
    
    // Strengthen the key by running through PBKDF2.
    //return this.deriveKey(symKey, salt);
    
  },
  
  encryptMessage: function (keylistId, message) {
    
    // Encrypt the message using the symmetric key.
    var symKey = this.generateRandomHex(256);
    var keyfile = this.getKeyfile();
    
    var encryptedMessage = sjcl.encrypt(symKey, message);

    // Encrypt and sign a copy of the symmetric key for everyone.
    var encryptedKeys = this.encryptMessageKeys(keylistId, message, symKey);
    
    // Stringify and base-64 encode the final message, then return it.
    var messageJson = { message: encryptedMessage, keys:
        encryptedKeys, senderId: keyfile.userId };
    
    return this.encodeBase64(JSON.stringify(messageJson));
    
  },
  
  encryptMessageKeys: function (keylistId, message, messageKey) {
    
    var encryptedKeys =  {};
    
    var keyfile = this.getKeyfile();
    var senderId = keyfile.userId;

    var keylist = keyfile.getKeylist(keylistId);
    // console.log(keylist[senderId]);
    // Get the sender's private signature key.
    var privateSignatureKey = keylist[senderId].signatureKeypair.privateKey;
      
    _.each(keylist, function (keypairs, recipientId) {

      if (recipientId != '_transactions') {
        
        // Get the recipient's public encryption keys.
        var publicEncryptionKey = keypairs.encryptionKeypair.publicKey;

        // Prepend the sender name to the plaintext.
        var messageTxt = JSON.stringify({
          sender: keyfile.userId, message: messageKey });

        // Sign the message using the sender's private key.
        var sha256 = sjcl.hash.sha256.hash(messageTxt);
        var signature = privateSignatureKey.sign(sha256);
        var signatureTxt = JSON.stringify(signature);

        // Append the sender's signature to the message.
        var contentTxt = JSON.stringify({
          message: messageTxt, signature: signature});

        // Encrypt the message using the recipient public key.
        var symKey = publicEncryptionKey.kem(0);
        var cipherTxt = sjcl.encrypt(symKey.key, contentTxt);

        // Build the final message and convert it to a string.
        var messageJson = { 'ct': cipherTxt, 'tag': symKey.tag };
        var messageTxt = JSON.stringify(messageJson);
        var messageBase64 = Crypto.encodeBase64(messageTxt);

        encryptedKeys[recipientId] = messageBase64;
        
      }
      
    });
    
    return encryptedKeys;
    
  },

  decryptMessage: function (keylistId, messageTxt64) {
    
    // Get the keyfile.
    var keyfile = this.getKeyfile();
    
    // Base-64 decode and JSON-parse the received message.
    var messageTxt = Crypto.decodeBase64(messageTxt64);
    var messageJson = JSON.parse(messageTxt);

    var senderId = messageJson.senderId;
  
    // Get the encryption and signature keys.
    var privateEncryptionKey = keyfile
      .getPrivateEncryptionKey(keylistId, keyfile.userId);
    
    var publicSignatureKey = keyfile
      .getPublicSignatureKey(keylistId, senderId);
    
    var encMessage = messageJson.message;
    
    var encSymKeyTxt64 = messageJson.keys[keyfile.userId];
    var keyMessageJson = JSON.parse(this.decodeBase64(encSymKeyTxt64));
    
    // Decrypt the message using the recipient's private key.
    var symKey = privateEncryptionKey.unkem(keyMessageJson.tag);
    
    var contentTxt = sjcl.decrypt(symKey, keyMessageJson.ct);
    var contentJson = JSON.parse(contentTxt);
    
    // Verify the message signature using the signature public key.
    var keyMessageJson = JSON.parse(contentJson.message);
    var keySignatureJson = contentJson.signature;
    
    var sha256 = sjcl.hash.sha256.hash(contentJson.message);
    var verified = publicSignatureKey.verify(sha256, keySignatureJson);
    
    if (!verified) throw 'Signature verification failed.'
    
    //if (message.sender != recipient)
    //  throw 'Incorrect recipient for message.'
    
    var plaintext = sjcl.decrypt(keyMessageJson.message, messageJson.message);
 
    // Return decrypted message if everything went fine.
    return plaintext;

  },


  decodeBase64ThenDecrypt: function (key, message) {
    
    // Base64-decode, then decrypt the resulting message.
    return sjcl.decrypt(key, this.decodeBase64(message));
    
  },

  encryptThenEncodeBase64: function (key, message) {
    
    // Encrypt, then Base64-encode the resulting message.
    return this.encodeBase64(sjcl.encrypt(key, message));
    
  },

 decodeBase64: function (base64) {
   
   // Uses SJCL to decode base 64 to text.
   var bits = sjcl.codec.base64.toBits(base64);
   return sjcl.codec.utf8String.fromBits(bits);
   
 },
 
 encodeBase64: function (utf8String) {
   
   // Uses SJCL to encode base64 to text.
   var bits = sjcl.codec.utf8String.toBits(utf8String);
   return sjcl.codec.base64.fromBits(bits);
   
 },
 
 seedRandom: function (randomValues) {
   return sjcl.random.addEntropy(randomValues);
 },
 
 file: {
   
   upload: function (data, pass, worker, id, csrf, url) {
     
     var data = event.data['data'];
     var pass = event.data['pass'];
     var worker = event.data['worker'];
     var id = event.data['id'];
     var csrf = event.data['csrf'];
     var url = event.data['url'];

     var key = data.key;
     var chunk = data.chunk;

     var reader = new FileReader();

     reader.onload = function(event) {

       var chunk = event.target.result;

       var encrypted = sjcl.encrypt(key, chunk);
       var data = new Blob([encrypted]);

       var fd = new FormData();

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
       xhr.send(fd);

     };

     reader.readAsDataURL(chunk);

   },
   

   download: function () {
     
     var id = event.data['id'];
     var chunk = event.data['chunk'];

     var worker = event.data['worker'];
     var url = event.data['url'];

     var encKey = event.data['key'];

     if (!privateKey) {
       var privKeyJson = event.data['privKey'];
       var privKey = buildPrivateKey(privKeyJson);
     }

     var key = decrypt(privKey, encKey);

     var xhr = new XMLHttpRequest();

     xhr.addEventListener('load', function(event) {

       if (event.target.status != 200) {

         throw 'Server error (' + event.target.status + ')';

       } else {

         var cryptChunk = event.target.responseText;
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

       }

     });

     xhr.addEventListener(
       "error", function () { throw "Error!"; }, false);

     xhr.addEventListener(
       "abort", function () { throw "Abort!"; }, false);

     xhr.open('GET', url + '/' + chunk);
     xhr.setRequestHeader("X-REQUESTED-WITH", "XMLHttpRequest");
     xhr.send('');
     
   }
   
 }

};