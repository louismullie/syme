Keyfile = function(userId, password, encKeyfile) {
  
  var that = this;
  
  that.userId = userId;
  that.password = password;
  that.encKeyfile = encKeyfile;
  that.keyfileJson = {};
  that.keyfile = {};
  
  that.getEncryptedKeyfile = function () {
    
    var keyfileTxt = JSON.stringify(that.serialize());
  
    return Crypto.encryptThenEncode64(that.password, keyfileTxt);

  };
  
  that.decryptKeyfile = function () {
    
    var keyfileTxt = Crypto.decode64ThenDecrypt(password, that.encKeyfile);
    
    var keyfileJson = JSON.parse(keyfileTxt);
    
    return that.buildKeyfile(keyfileJson, that.userId);
    
  };
  
  that.buildKeyfile = function (keylistJson) {
  
   var keyfile = {};

    // Iterate over every keylist inside the keyfile.
    _.each(keyfileJson, function (keylistJson, keylistId) {

       // Build the keypairs inside the key list and register.
       keyfile[keylistId] = that.buildKeylist(keylistJson);

    });
    
    this.keyfile = keyfile;
    
    return null;
    
  };
  
  that.buildKeylist = function (keylistJson) {
    
    var keylist = {};
    
    // Iterate over every keypair inside the keyfile.
    _.each(keylistJson, function (keypairs, userId) {

      // Build the key objects and register them.
      var keypairs = that.buildKeypairs(keypairs);
      keylist[userId] = keypairs;
    
    });
    
    // Return the final keylist.
    return keylist;
    
  };
  
  that.buildKeypairs = function(keypairsJson) {
      
    // Verify that encryption keys are present.
    if (!keypairsJson.encryptionKeypair)
      throw 'Encryption key(s) missing.';
    
    // Verify that the decryption keys are present.
    if (!keypairsJson.signatureKeypair)
      throw 'Signature key(s) missing.'
    
    var encryptionKeypair = that
      .buildKeypair(keypairsJson.encryptionKeypair);
    
    var signatureKeypair = that
      .buildKeypair(keypairsJson.signatureKeypair);
    
    // Build the keypair objects.
    var keypairs = {
      encryptionKeypair: encryptionKeypair, 
      signatureKeypair: signatureKeypair
    };
    
    // Return the keypairs in JSON format.
    return keypairs;
    
  };
  
  that.buildKeypair = function(keypairJson) {
    
    // Check for presence of the public key.
    if (!keypairJson.publicKey)
      throw 'Public key is missing.'
      
    // Build the public key and the keypair object.
    var publicKey = that.buildPublicKey(keypairJson.publicKey);
    var keypair = { publicKey: publicKey };
    
    // Build the private key if it is present.
    if (keypairJson.privateKey) {
      keypair.privateKey =
      that.buildPrivateKey(keypairJson.privateKey);
    }
    
    // Return the keypair objects.
    return keypair;
    
  };
  
  that.buildPublicKey = function (pubJson) {

    // Retrieve the point from the serialized key.
    var point = sjcl.ecc.curves["c" + pubJson.curve]
      .fromBits(pubJson.point);

    // Build the key from the curve and the point.
    var publicKey = new sjcl.ecc.elGamal
      .publicKey(pubJson.curve, point.curve, point);

    // Return the public key object.
    return publicKey;
    
  },

  that.buildPrivateKey = function (privJson) {

    // Retrieve the exponent from the serialized key.
    var exponent = sjcl.bn.fromBits(privJson.exponent);

    // Retrieve the curve number and build the private key.
    var curve = "c" + privJson.curve;
    var privateKey = new sjcl.ecc.elGamal.secretKey(
        privJson.curve, sjcl.ecc.curves[curve], exponent);

    // Return the private key object.
    return privateKey;
  };

  that.serialize = function () {
    
    var keyfileJson = {};
    
    _.each(that.keyfile, function (keylist, keylistId) {
      keyfileJson[keylistId] = that.serializeKeylist(keylist);
    });
    
    return keyfileJson;
    
  };
  
  that.serializeKeylist = function (keylist) {
    
    var keylistJson = {};
    
    _.each(keylist, function (keypairs, userId) {
      keylistJson[userId] = that.serializeKeypairs(keypairs);
    });
    
    return keylistJson;
    
  };
  
  that.serializeKeypairs = function (keypairs) {
    
    if (typeof(keypairs.signatureKeypair) == 'undefined' ||
        typeof(keypairs.encryptionKeypair) == 'undefined')
      throw JSON.stringify(keypairs.signatureKeypair);
    
    var signatureKeypair = that
      .serializeKeypair(keypairs.signatureKeypair);
    
    var encryptionKeypair = that
      .serializeKeypair(keypairs.encryptionKeypair);
    
    return { encryptionKeypair: encryptionKeypair,
             signatureKeypair: signatureKeypair };
    
  };
  
  that.serializeKeypair = function (keypair) {
    
    var privateKey = keypair.sec || keypair.privateKey;
    var publicKey = keypair.pub || keypair.publicKey;
    
    if (privateKey)
      privateKeyJson = this.serializePrivateKey(privateKey);
    
    var publicKeyJson = this.serializePublicKey(publicKey);
    
    return { privateKey: privateKeyJson, publicKey: publicKeyJson };
  
  };
  
  that.serializePublicKey = function (publicKey) {
    
    // Calls the ECC branch serialize method.
    return publicKey.serialize ? publicKey.serialize() : publicKey;
    
  };
  
  that.serializePrivateKey = function (privateKey) {
    
    // Calls the ECC branch serialize method.
    return privateKey.serialize ? privateKey.serialize() : privateKey;
    
  };
  
  that.createKeylist = function (keylistId) {
    
    var encryptionKeypair = that.generateEncryptionKeypair();
    var signatureKeypair = that.generateSignatureKeypair();

    that.keyfile[keylistId] = {};
    
    that.keyfile[keylistId][that.userId] = {
      encryptionKeypair: encryptionKeypair,
      signatureKeypair: signatureKeypair
    };
    
  };
  
  that.generateEncryptionKeypair = function () {
    
    // Generate a new keypair for ECC encryption.
    var keypair = sjcl.ecc.elGamal.generateKeys(384, 1);
    
    // Serialize the keypair to JSON.
    return { publicKey: keypair.pub, privateKey: keypair.sec };
    
  };
  
  that.generateSignatureKeypair = function () {
    
    // Generate a new keypair for ECDSA signing.
    var keypair = sjcl.ecc.ecdsa.generateKeys(384, 1);
    
    // Serialize the keypair to JSON.
    return { publicKey: keypair.pub, privateKey: keypair.sec };
    
  };
  
  that.getKeylist = function (keylistId) {
    
    var keylist = that.keyfile[keylistId];
    
    if (!keylist)
      throw 'Keylist does not exist.'
    
    return keylist;
    
  };
  
  that.addKeypairs = function (keylistId, userId, keypairsJson) {
    
    if (!that.keyfile[keylistId])
      throw 'Keylist does not exist.'
    
    var keypairs = that.buildKeypairs(keypairsJson);
    
    that.keyfile[keylistId][userId] = keypairs;
    
    return null;
      
  };
  
  that.getPublicSignatureKey = function(groupId, userId) {
    
    var keylist = this.getKeylist(groupId);
    
    if (!keylist[that.userId] ||
        !keylist[that.userId].signatureKeypair ||
        !keylist[that.userId].signatureKeypair.publicKey)
      throw 'Private key not initialized.'
  
    return keylist[that.userId].signatureKeypair.publicKey;
    
    
  };
  
  that.getPrivateEncryptionKey = function(groupId) {
    
    var keylist = this.getKeylist(groupId);
    
    if (!keylist[that.userId] ||
        !keylist[that.userId].encryptionKeypair ||
        !keylist[that.userId].encryptionKeypair.privateKey)
      throw 'Private key not initialized.'
  
    return keylist[that.userId].encryptionKeypair.privateKey;
    
  };
  
  if (encKeyfile) that.decryptKeyfile();
  
};