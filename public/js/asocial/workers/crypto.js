importScripts('keyfile.js');
importScripts('formData.js');

Crypto = {
  
  keyfile: null,
  
  generateKeyfile: function (currentUserId) {
    
    this.keyfile = new Keyfile({}, currentUserId);
    
    return null;
    
  },
  
  decryptKeyfile: function (encKeyfileTxt64, password, currentUserId) {
    
    var keyfileTxt = this.decode64ThenDecrypt(
      password, encKeyfileTxt64);
    
    var keyfileJson = JSON.parse(keyfileTxt);
    
    var _this = this;
    
    var keyfile = {};
    
    // Iterate over every keylist inside the keyfile.
    _.each(keyfileJson, function (keylistId, keylistJson) {
      
       // Build the keypairs inside the key list and register.
       keyfile[keylistId] = _this.buildKeylist(keylistJson);
      
    });
    
    return this.buildKeyfile(keyfile, currentUserId);
    
  },
  
  buildKeyfile: function (keyfileJson, currentUserId) {
    
    this.keyfile = new Keyfile(keyfileJson, currentUserId);
    
    return null;
    
  },
  
  generateKeylist: function (keylistId) {
    
    if (!this.keyfile) throw 'Keyfile is not initialized.';
    
    var encryptionKeypair = this.generateEncryptionKeypair();
    var signatureKeypair = this.generateSignatureKeypair();
    
    this.keyfile.createKeylist(keylistId, {
      encryptionKeypair: encryptionKeypair,
      signatureKeypair: signatureKeypair
    });
    
  },
  
  getKeyfile: function () {
    
    if (!this.keyfile) throw 'Keyfile not initialized.';
    
    return this.keyfile.keyfile;
    
  },
  
  getEncryptedKeyfile: function (password) {
    
    var keyfile      = this.getKeyfile();
    var keyfileTxt   = JSON.stringify(keyfile);
    
    return this.encryptThenEncode64(password, keyfileTxt);
    
  },
  
  buildKeylist: function (keylistJson) {
    
    var keylist = {};
    
    var _this = this;
    
    // Iterate over every keypair inside the keyfile.
    _.each(keylistJson, function (userId, keypairs) {

      // Build the key objects and register them.
      var keypairs = _this.buildKeypairs(keypairs);
      keylist[keylistId][userId] = keypairs;
    
    });
    
    // Return the final keylist.
    return keylist;
    
  },
  
  buildKeypairs: function(keypairsJson) {
      
    // Verify that encryption keys are present.
    if (!keypairsJson.encryptionKeypair)
      throw 'Encryption key(s) missing.'
    
    // Retrieve the encryption keys.
    var encPubKey = keypairsJson.encryptionKeypair.publicKey;
    var encPrivKey = keypairsJson.encryptionKeypair.privateKey;
    
    // Verify that the decryption keys are present.
    if (!keypairsJson.signatureKeypair)
      throw 'Signature key(s) missing.'
    
    // Retrieve the signature keys.
    var sigPubKey = keypairsJson.signatureKeypair.publicKey;
    var sigPrivKey = keypairsJson.signatureKeypair.privateKey;
    
    // Build the keypair objects.
    var keypairs = {
      encryption: this.buildKeypair(encPubKey, encPrivKey), 
      signature: this.buildKeypair(sigPubKey, sigPrivKey)
    };
    
    // Return the keypairs in JSON format.
    return keypairs;
    
  },
  
  buildKeypair: function(publicKeyJson, privateKeyJson) {
    
    // Check for presence of the public key.
    if (!publicKeyJson)
      throw 'Public key is missing.'
      
    // Build the public key and the keypair object.
    var publicKey = this.buildPublicKey(publicKeyJson);
    var keypairJson = { publicKey: publicKey };
    
    // Build the private key if it is present.
    if (privateKeyJson) {
      keypairJson.privateKey =
      this.buildPrivateKey(privateKeyJson);
    }
    
    // Return the keypair objects as JSON.
    return keypairJson;
    
  },
  
  generateEncryptionKeypair: function () {
    
    // Generate a new keypair for ECC encryption.
    var keypair = sjcl.ecc.elGamal.generateKeys(384, 1);
    
    // Serialize the keypair to JSON.
    return this.serializeKeypair(keypair);
    
  },
  
  generateSignatureKeypair: function () {
    
    // Generate a new keypair for ECDSA signing.
    var keypair = sjcl.ecc.ecdsa.generateKeys(384, 1);
    
    // Serialize the keypair to JSON.
    return this.serializeKeypair(keypair);
    
  },
  
  generateRandomHex: function (bytes) {

    // Generate some random words.
    var randomWords = sjcl.random.randomWords(bytes / 4, 0);
    
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
  
  diffieHellman: function (publicKeyAJson, publicKeyBJson) {
    
    // Build the public key objects from their serialized forms.
    var publicKeyA = this.buildPublicKey(publicKeyAJson);
    var publicKeyB = this.buildPublicKey(publicKeyBJson);
    
    // Calculate the Diffie-Hellman shared key.
    var symKey = publicKeyA.dh(publicKeyB);
    
    // Strengthen the key by running through PBKDF2.
    return this.deriveKey(symKey, salt);
    
  },
  
  encryptMessage: function (keylist, sender, recipients, plainTxt) {
    
    // Get the sender's private signature key.
    var privateSignatureKey = keylist.privateSignatureKey(sender);

    // Encrypt the message using the symmetric key.
    var symmetricEncryptionKey = this.generateRandomSymmetricKey();
    var encryptedMessage = sjcl.encrypt(symmetricEncryptionKey, plainTxt);
    
    // Encrypt and sign a copy of the symmetric key for everyone.
    var encryptedKeys = this.encryptMessageKey(symmetricEncryptionKey);
    
    // Stringify and base-64 encode the final message, then return it.
    var messageJson = { message: encryptedMessage, keys: encryptedKeys };
    
    return Crypto.encodeBase64(JSON.stringify(messageJson));
    
  },
  
  encryptMessageKey: function (keylist, sender, recipient, messageKey) {
    
    var encryptedKeys =  {};
    
    // Get the sender's private signature key.
    var privateSignatureKey = keylist.getPrivateSignatureKey(recipient);
    
    _recipients.each(function (recipient) {
      
      // Get the recipient's public encryption keys.
      var publicEncryptionKey = keylist.getPublicEncryptionKey(recipient);
      
      // Prepend the sender name to the plaintext.
      var messageTxt = JSON.stringify({
        recipient: recipient, message: messageKey });

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
      
      encryptedKeys[recipient] = messageBase64;
      
    });
    
    return encryptedKeys;
    
  },

  decryptMessage: function (keylist, sender, recipient, messageTxt64) {
    
    // Get the encryption and signature keys.
    var privateDecryptionKey = keylist.getPrivateDecryptionKey(recipient);
    var publicSignatureKey = keylist.getPpublicSignatureKey(sender);

    // Base-64 decode and JSON-parse the received message.
    var messageTxt = Crypto.decodeBase64(messageTxt64);
    var messageJson = JSON.parse(messageTxt);

    // Decrypt the message using the recipient's private key.
    var symKey = privateKey.unkem(messageJson.tag);
    var contentTxt = sjcl.decrypt(symKey, messageJson.ct);
    var contentJson = JSON.parse(contentTxt);
    
    // Verify the message signature using the signature public key.
    var messageJson = JSON.parse(contentJson.message),
        signatureJson = JSON.parse(contentJson.signature);
    
    var sha256 = sjcl.hash.sha256.hash(contentJson.message);
    var verified = publicSignatureKey.verify(sha256, signatureJson);
    
    if (!verified) throw 'Signature verification failed.'

    // Verify the recipient ID is correct.
    var message = JSON.parse(contentJson.message);
    
    if (message.recipient != recipient)
      throw 'Incorrect recipient for message.'
    
    // Return decrypted message if everything went fine.
    return message.message;

  },

  serializePublicKey: function (publicKey) {
    
    // Calls the ECC branch serialize method.
    return publicKey.serialize();
    
  },

  buildPublicKey: function (pubJson) {

    // Retrieve the point from the serialized key.
    var point = sjcl.ecc.curves["c" + pubJson.curve]
      .fromBits(pubJson.point);

    // Build the key from the curve and the point.
    var publicKey = new sjcl.ecc.elGamal
      .publicKey(pubJson.curve, point.curve, point);

    // Return the public key object.
    return publicKey;
    
  },

  serializePrivateKey: function (privateKey) {
    
    // Calls the ECC branch serialize method.
    return privateKey.serialize();
    
  },

  buildPrivateKey: function (privJson) {

    // Retrieve the exponent from the serialized key.
    var exponent = sjcl.bn.fromBits(privJson.exponent);

    // Retrieve the curve number and build the private key.
    var curve = "c" + privJson.curve;
    var privateKey = new sjcl.ecc.elGamal.secretKey(
        privJson.curve, sjcl.ecc.curves[curve], exponent);

    // Return the private key object.
    return privateKey;
  },

  serializeKeypair: function (keypair) {
    
    var privateKey = this.serializePrivateKey(keypair.sec);
    var publicKey = this.serializePublicKey(keypair.pub);
    
    return { privateKey: privateKey, publicKey: publicKey };
  
  },

  decode64ThenDecrypt: function (key, message) {
    
    // Base64-decode, then decrypt the resulting message.
    return sjcl.decrypt(key, this.decodeBase64(message));
    
  },

  encryptThenEncode64: function (key, message) {
    
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