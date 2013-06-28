Keyfile = function(userId, password, encKeyfile) {
  
  var that = this;
  
  that.userId = userId;
  that.password = password;
  that.encKeyfile = encKeyfile;
  that.keyfileJson = {};
  that.keyfile = {};
  
  that.getEncryptedKeyfile = function () {
    
    var keyfileJson = that.serialize();
    var keyfileTxt = JSON.stringify(keyfileJson);
  
    return Crypto.encryptThenEncode64(that.password, keyfileTxt);

  };
  
  that.decryptKeyfile = function () {
    
    var keyfileTxt = Crypto.decode64ThenDecrypt(password, that.encKeyfile);
    
    var keyfileJson = JSON.parse(keyfileTxt);
    
    return that.buildKeyfile(keyfileJson, currentUserId);
    
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
      encryption: encryptionKeypair, 
      signature: signatureKeypair
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
    
    return JSON.stringify(that.keyfile);
    
  };
  
  that.serializeKeypairs = function (keypairs) {
    
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
    return publicKey.serialize();
    
  };
  
  that.serializePrivateKey = function (privateKey) {
    
    // Calls the ECC branch serialize method.
    return privateKey.serialize();
    
  };
  
  that.generateKeylist = function (keylistId) {
    
    var encryptionKeypair = that.generateEncryptionKeypair();
    var signatureKeypair = that.generateSignatureKeypair();

    that.createKeylist(keylistId, {
      encryptionKeypair: encryptionKeypair,
      signatureKeypair: signatureKeypair
    });
    
  };
  
  that.generateEncryptionKeypair = function () {
    
    // Generate a new keypair for ECC encryption.
    var keypair = sjcl.ecc.elGamal.generateKeys(384, 1);
    
    // Serialize the keypair to JSON.
    return that.serializeKeypair(keypair);
    
  };
  
  that.generateSignatureKeypair = function () {
    
    // Generate a new keypair for ECDSA signing.
    var keypair = sjcl.ecc.ecdsa.generateKeys(384, 1);
    
    // Serialize the keypair to JSON.
    return that.serializeKeypair(keypair);
    
  };
  
  that.createKeylist = function (keylistId, currentUserKeypairs) {
    
    if (!that.keyfile)
      
    that.keyfile[keylistId] = {};
    
    that.keyfile[keylistId][that.userId] = currentUserKeypairs;
    
  };
  
  that.getKeylist = function (keylistId) {
    
    var keylist = that.keyfile[keylistId];
    
    if (!keylist)
      throw 'Keylist does not exist.'
    
    return keylist;
    
  };
  
  that.createKeypairs = function (keylistId, userId, keypairsJson) {
    
    if (!that.keyfile[keylistId])
      throw 'Keylist does not exist.'
    
    that.keyfileJson[keylistId][userId] = keypairsJson;
    
    var keypairs = that.buildKeypairs(keypairsJson);
    
    that.keyfile[keylistId][userId] = keypairs;
    
    return null;
      
  };
  
  that.getKeypair = function (groupId, userId, typeCallback) {
    
    var userId = userId || that.currentUserId;
    var keylist = that.keylistForGroup(groupId);
    
    return typeCallback(keylist, userId);
    
  };
  
  that.getPublicSignatureKey = function(groupId, userId) {
    
    var typeCallback = that.signatureKeypairForUser;
    var keypair = that.getKeypair(groupId, userId, typeCallback);
  
    return keypair.publicKey;
    
  };
  
  that.getPublicEncryptionKey = function(groupId, userId) {
    
    var typeCallback = that.encryptionKeypairForUser;
    var keypair = that.getKeypair(groupId, userId, typeCallback);
  
    return keypair.publicKey;
    
  };
  
  that.getPrivateSignatureKey = function(groupId) {
    
    var typeCallback = that.signatureKeypairForUser;
    var keypair = that.getKeypair(groupId, currentUserId, typeCallback);
  
    if (!keypair.privateKey) throw 'Private key does not exist..'
  
    return keypair.privateKey;
    
  };
  
  that.getPrivateEncryptionKey = function(groupId) {
    
    var typeCallback = that.encryptionKeypairForUser;
    var keypair = that.getKeypair(groupId, currentUserId, typeCallback);
  
    if (!keypair.privateKey) throw 'Private key does not exist.'
  
    return keypair.privateKey;
    
  };
  
  that.getKeypairsForUser = function (keylist, userId) {
    
    var keypairs = keylist[userId];
    
    if (!keypairs)  throw 'User does not exist.'
    
    if (!keypairs.encryptionKeypair)
      throw 'Encryption keypair does not exist.'
      
    if (!keypairs.signatureKeypair)
      throw 'Signature keypair does not exist.'
    
    return keypairs;
    
  };
  
  // Type is 'encryptionKeypair' or 'signatureKeypair'
  that.getKeypair = function(keylist, userId, type) {
    
    var keypairs = that.keypairsForUser(keylist, userId)
    var keypair = keypairs[type];
    
    if (!keypair.publicKey)
      throw 'Public key does not exist.'
    
    return keypair;
    
  };
  
  that.getEncryptionKeypair = function(keylist, userId) {
    
    return that.getKeypair(keylist, userId, 'encryptionKeypair');
    
  };
  
  that.getSignatureKeypair = function(keylist, userId) {
    
    return that.getKeypair(keylist, userId, 'signatureKeypair');
    
  };
  
  if (encKeyfile) that.decryptKeyfile();
  
};