importScripts('keyfile.js');

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
  
  transferKeysRequest: function (keylistId, newUserId, keysJson) {
    
    var keyfile = this.getKeyfile(keylistId);
    
    var recryptedKeys = this.encodeBase64(JSON.stringify({
      posts: this.recryptPosts(keylistId, newUserId, keysJson.posts),
      uploads: this.recryptResource(keylistId, newUserId, keysJson.uploads)
    }));
    
    return recryptedKeys;
    
  },
  
  recryptResource: function (keylistId, newUserId, arr) {

    var result = [];

    var keyfile = this.getKeyfile();
    var signerId = keyfile.userId;
    var _this = this;
    
    _.each(arr, function (elem, ind) {
      
      var decryptedKey = _this.decryptMessageKey(keylistId, elem.key);
      
      var key = _this.encryptMessageKey(
        keylistId, newUserId, decryptedKey);
        
      //throw JSON.stringify([elem, decryptedKey, key]);
      
      result.push({ id: elem.id, key: key });
      
    });
  
    return result;

  },

  recryptPosts: function (keylistId, newUserId, posts) {

    var result = [];
    
    var keyfile = this.getKeyfile();
    var signerId = keyfile.userId;

    var _this = this;

    _.each(posts, function (post, index) {
      
      var decryptedKey = _this.decryptMessageKey(keylistId, post.key);
      
      var key = _this.encryptMessageKey(
        keylistId, newUserId, decryptedKey);
      
      var comments = _this.recryptResource(
        keylistId, newUserId, post.comments);
      
      result.push({ id: post.id, key: key, comments: comments });
      
    });

    return result;

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
    var messageJson = { message: encryptedMessage, keys: encryptedKeys  };
    
    return this.encodeBase64(JSON.stringify(messageJson));
    
  },
  
  encryptMessageKeys: function (keylistId, message, messageKey) {
    
    var keyfile = this.getKeyfile();
    var keylist = keyfile.getKeylist(keylistId);
    var _this = this;
    
    var encryptedKeys =  {};
    
    _.each(keylist, function (keypairs, recipientId) {

      if (recipientId != '_transactions') {
        
        encryptedKeys[recipientId] = _this.encryptMessageKey(
          keylistId, recipientId, messageKey);
      }
      
    });
    
    return encryptedKeys;
    
  },
  
  encryptMessageKey: function (keylistId, recipientId, messageKey) {
    
    var keyfile = this.getKeyfile();
    var keylist = keyfile.getKeylist(keylistId);
    
    var privateSignatureKey = keyfile.getPrivateSignatureKey(keylistId);
    
    // Get the recipient's public encryption keys.
    var publicEncryptionKey = keyfile.getPublicEncryptionKey(keylistId, recipientId);

    // Prepend the sender name to the plaintext.
    var messageTxt = JSON.stringify({
      recipient: recipientId, message: messageKey });

    // Sign the message using the sender's private key.
    var sha256 = sjcl.hash.sha256.hash(messageTxt);
    var signature = privateSignatureKey.sign(sha256);
    var signatureTxt = JSON.stringify(signature);

    // Append the sender's signature to the message.
    var contentTxt = JSON.stringify({
      message: messageTxt,
      signature: signature,
      signerId: keyfile.userId
    });

    // Encrypt the message using the recipient public key.
    var symKey = publicEncryptionKey.kem(0);
    
    var cipherTxt = sjcl.encrypt(symKey.key, contentTxt);

    // Build the final message and convert it to a string.
    var messageJson = { 'ct': cipherTxt, 'tag': symKey.tag };
    var messageTxt = JSON.stringify(messageJson);
    var messageBase64 = Crypto.encodeBase64(messageTxt);

    return messageBase64;
    
  },

  decryptMessage: function (keylistId, messageTxt64) {
    
    // Get the keyfile.
    var keyfile = this.getKeyfile();
    var keylist = keyfile.getKeylist(keylistId);
    
    // Base-64 decode and JSON-parse the received message.
    var messageTxt = Crypto.decodeBase64(messageTxt64);
    
    var messageJson = JSON.parse(messageTxt);
  
    var encMessage = messageJson.message;
    
    if (!encMessage) throw 'Message is missing.';
    
    var encSymKeyTxt64 = messageJson.keys[keyfile.userId];
    
    if (!encSymKeyTxt64) throw 'Key is missing.'
    
    var decryptedSymKey = this.decryptMessageKey(
      keylistId, encSymKeyTxt64);
      
    var plaintext = sjcl.decrypt(
      decryptedSymKey, messageJson.message);
 
    return plaintext;

  },
  
  decryptMessageKey: function (keylistId, encSymKeyTxt64) {
    
    // Get the keyfile.
    var keyfile = this.getKeyfile();
    
    // Get the encryption and signature keys.
    var privateEncryptionKey = keyfile.getPrivateEncryptionKey(keylistId);

    var keyMessageJson = JSON.parse(this.decodeBase64(encSymKeyTxt64));
    
    // Decrypt the message using the recipient's private key.
    var symKey = privateEncryptionKey.unkem(keyMessageJson.tag);
    
    var contentTxt = sjcl.decrypt(symKey, keyMessageJson.ct);
    var contentJson = JSON.parse(contentTxt);
    
    // Verify the message signature using the signature public key.
    var keyMessageJson = JSON.parse(contentJson.message);
    var keySignatureJson = contentJson.signature;
    
    var publicSignatureKey = keyfile.
      getPublicSignatureKey(keylistId, contentJson.signerId);

      // Check sender in keylist...
    if (!contentJson.signerId) throw 'Signer ID is missing.';
    
    var sha256 = sjcl.hash.sha256.hash(contentJson.message);
    
    var verified = publicSignatureKey.verify(sha256, keySignatureJson);
    
    if (!verified) throw 'Signature verification failed.'
    
    return keyMessageJson.message;
    
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
 }

};