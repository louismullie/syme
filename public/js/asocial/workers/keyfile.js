Keyfile = function(userId, password, encKeyfile) {
  
  var that = this;
  
  that.userId = userId;
  that.password = password;
  that.encKeyfile = encKeyfile;
  that.keyfileJson = {};
  that.keyfile = {};
  
  that.getEncryptedKeyfile = function () {
    
    var keyfileTxt = JSON.stringify(that.serialize());
  
    return Crypto.encryptThenEncodeBase64(that.password, keyfileTxt);

  };
  
  that.decryptKeyfile = function () {
    
    var keyfileTxt = Crypto.decodeBase64ThenDecrypt(password, that.encKeyfile);
    
    var keyfileJson = JSON.parse(keyfileTxt);
    
    return that.buildKeyfile(keyfileJson, that.userId);
    
  };
  
  that.buildKeyfile = function (keyfileJson) {
  
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
      if (userId != '_transactions')
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
      .buildKeypair(keypairsJson.encryptionKeypair, 'encryption');
    
    var signatureKeypair = that
      .buildKeypair(keypairsJson.signatureKeypair, 'signature');
    
    // Build the keypair objects.
    var keypairs = {
      encryptionKeypair: encryptionKeypair, 
      signatureKeypair: signatureKeypair
    };
    
    // Return the keypairs in JSON format.
    return keypairs;
    
  };
  
  that.buildKeypair = function(keypairJson, type) {
    
    if (!type) throw 'Keypair type is missing';
    
    // Check for presence of the public key.
    if (!keypairJson.publicKey) throw 'Public key is missing.'
      
    // Build the public key and the keypair object.
    var publicKey = that.buildPublicKey(keypairJson.publicKey, type);
    var keypair = { publicKey: publicKey };
    
    // Build the private key if it is present.
    if (keypairJson.privateKey) {
      keypair.privateKey =
      that.buildPrivateKey(keypairJson.privateKey, type);
    }
    
    // Return the keypair objects.
    return keypair;
    
  };
  
  that.buildPublicKey = function (pubJson, type ) {
    
    var keyType = that.getKeyType(type);

    // Retrieve the point from the serialized key.
    var point = sjcl.ecc.curves["c" + pubJson.curve]
      .fromBits(pubJson.point);

    // Build the key from the curve and the point.
    var publicKey = new keyType.publicKey(
        pubJson.curve, point.curve, point);

    // Return the public key object.
    return publicKey;
    
  },

  that.buildPrivateKey = function (privJson, type) {

    var keyType = that.getKeyType(type);
    
    // Retrieve the exponent from the serialized key.
    var exponent = sjcl.bn.fromBits(privJson.exponent);

    // Retrieve the curve number and build the private key.
    var curve = "c" + privJson.curve;
    
    var privateKey = new keyType.secretKey(
        privJson.curve, sjcl.ecc.curves[curve], exponent);

    // Return the private key object.
    return privateKey;
  };

  that.getKeyType = function(type) {
    
    var keyType;
    
    if (type == 'encryption') {
      keyType = sjcl.ecc.elGamal;
    } else if (type == 'signature') {
      keyType = sjcl.ecc.ecdsa;
    } else {
      throw 'Keypair type is missing or invalid';
    }
    
    return keyType;

  };
  
  that.serialize = function () {
    
    var keyfileJson = {};
    
    _.each(that.keyfile, function (keylist, keylistId) {
      keyfileJson[keylistId] = that.serializeKeylist(keylist);
    });
    
    return keyfileJson;
    
  };
  
  that.serializeKeylist = function (keylist, safeMode) {
    
    var keylistJson = {};
    
    _.each(keylist, function (keypairs, userId) {
      
      if (userId != '_transactions')
        keypairs = that.serializeKeypairs(keypairs, safeMode);
      
      if (!(safeMode && userId == '_transactions'))
        keylistJson[userId] = keypairs;
      
     
    });
    
    return keylistJson;
    
  };
  
  that.serializeKeypairs = function (keypairs, safeMode) {
    
    if (typeof(keypairs.signatureKeypair) == 'undefined' ||
        typeof(keypairs.encryptionKeypair) == 'undefined')
      throw 'Missing signature or encryption keypair.'

    var signatureKeypair = that
      .serializeKeypair(keypairs.signatureKeypair, safeMode);
    
    var encryptionKeypair = that
      .serializeKeypair(keypairs.encryptionKeypair, safeMode);
    
    return { encryptionKeypair: encryptionKeypair,
             signatureKeypair: signatureKeypair };
    
  };
  
  that.serializeKeypair = function (keypair, safeMode) {
    
    var privateKey = keypair.sec || keypair.privateKey;
    var publicKey = keypair.pub || keypair.publicKey;
    
    var publicKeyJson = that.serializePublicKey(publicKey);
    var keypair = { publicKey: publicKeyJson };
    
    if (privateKey && !safeMode)
      keypair.privateKey = that.serializePrivateKey(privateKey);
    
    return keypair;
  
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

    that.keyfile[keylistId] = { _transactions: { } };
    
    that.keyfile[keylistId][that.userId] = {
      encryptionKeypair: encryptionKeypair,
      signatureKeypair: signatureKeypair
    };
    
  };
  
  that.deleteKeylist = function (keylistId) {
    
    var keylist = this.getKeylist(keylistId);
    delete this.keyfile[keylistId];
    
    return null;
    
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
    
    var keylist = that.getKeylist(keylistId);
    
    var keypairs = that.buildKeypairs(keypairsJson);
    
    //console.log('Adding keypairs for ' + userId + ' to user ' + that.userId, keypairs);

    //console.log(that.getKeylist(keylistId));
    
    that.keyfile[keylistId][userId] = keypairs;
    
    return null;
      
  };
  
  that.getPublicSignatureKey = function(groupId, userId) {
    
    var keylist = this.getKeylist(groupId);
    var userId = userId || that.userId;
    
    if (!keylist[userId] || !keylist[userId].signatureKeypair ||
        !keylist[userId].signatureKeypair.publicKey)
      throw 'Signature public key not initialized.';
  
    return keylist[userId].signatureKeypair.publicKey;
    
    
  };
  
  that.getPublicEncryptionKey = function(groupId, userId) {
    
    var keylist = this.getKeylist(groupId);
    var userId = userId || that.userId;
    
    if (!keylist[userId] || !keylist[userId].encryptionKeypair ||
        !keylist[userId].encryptionKeypair.publicKey)
      throw 'Encryption public key not initialized.';
  
    return keylist[userId].encryptionKeypair.publicKey;
    
  };
  
  that.getPrivateEncryptionKey = function(groupId) {
    
    var keylist = this.getKeylist(groupId);
    
    if (!keylist[that.userId] ||
        !keylist[that.userId].encryptionKeypair ||
        !keylist[that.userId].encryptionKeypair.privateKey)
      throw 'Private key not initialized.'
  
    return keylist[that.userId].encryptionKeypair.privateKey;
    
  };
  
  that.createTransaction = function (keylistId, transaction, type, key) {
    
    var transactions = that.getTransactions(keylistId);
    
    if (!transactions)
      throw 'Missing transaction type.'
    
    that.keyfile[keylistId]._transactions[type] = 
      that.keyfile[keylistId]._transactions[type] || {};
    
    that.keyfile[keylistId]._transactions[type][key] = transaction;
        
  };
  
  that.getTransactions = function (keylistId) {
    
    var keylist = that.getKeylist(keylistId);
    
    var transactions = keylist._transactions;
     
     if (!transactions)
       throw 'Transactions book not initialized.'
     
     return transactions;
     
  };
  
  that.getTransaction = function (keylistId, transactionType, transactionId) {
    
    var transactions = that.getTransactions(keylistId);
    
    if (!transactions[transactionType])
      throw 'No transactions of type: ' + transactionType + '.'
      
    if (!transactions[transactionType][transactionId])
      throw 'No transaction with requested ID.'
    
    return transactions[transactionType][transactionId];
    
  };
  
  that.getAndDeleteTransaction = function (keylistId, transactionType, transactionId) {
    
    var transaction = that.getTransaction(keylistId, transactionType, transactionId);
    
    delete that.keyfile[keylistId]['_transactions'][transactionType][transactionId];
    
    if (_.size(that.keyfile[keylistId]['_transactions'][transactionType]) == 0)
      delete that.keyfile[keylistId]['_transactions'][transactionType];
      
    return transaction;
    
  };
  
  that.createInviteRequest = function (keylistId, inviteeAlias) {
    
    var keylist = that.getKeylist(keylistId);
    
    var keypair = that.generateEncryptionKeypair();
    var keypairJson = that.serializeKeypair(keypair);
    
    var transaction = {
      inviteeAlias: inviteeAlias,
      inviterKeypair: keypairJson
    };
    
    var inviterPublicKey = that.serializePublicKey(keypair.publicKey);
    
    that.createTransaction(keylistId,
      transaction, 'createInviteRequest', inviteeAlias);
    
    var inviteRequest = {
      keylistId: keylistId,
      inviterId: that.userId,
      inviteeAlias: inviteeAlias,
      inviterPublicKey: inviterPublicKey
    };
    
    return Crypto.encodeBase64(JSON.stringify(inviteRequest));
    
  };
  
  that.acceptInviteRequest = function(inviteRequestBase64) {
    
    var inviteRequestTxt = Crypto.decodeBase64(inviteRequestBase64);
    var inviteRequest = JSON.parse(inviteRequestTxt);

    var inviterId = inviteRequest.inviterId;
    
    if (!inviteRequest.inviteeAlias || !inviteRequest.inviterId ||
        !inviteRequest.inviterPublicKey || !inviteRequest.keylistId) {
      throw 'Missing required parameters.';
    }
    var inviterPublicKeyJson = inviteRequest.inviterPublicKey;
    
    var inviterPublicKey = that.buildPublicKey(
      inviterPublicKeyJson, 'encryption');
      
    var keylistId = inviteRequest.keylistId;
    
    that.createKeylist(keylistId);
    
    var inviterPublicKey = that.buildPublicKey(
      inviteRequest.inviterPublicKey, 'encryption');
    
    var inviteeKeypair = that.generateEncryptionKeypair();
    var inviteeKeypairJson = that.serializeKeypair(inviteeKeypair);
    
    var token = Crypto.generateRandomHex(256);
    
    var symKey = Crypto.diffieHellman(
      inviteeKeypair.privateKey, inviterPublicKey);
    
    var transaction = {
      inviterId: inviterId,
      inviteeId: that.userId,
      inviterPublicKey: inviterPublicKeyJson,
      inviteeKeypair: inviteeKeypairJson,
      token: token,
      symKey: symKey
    };
      
    that.createTransaction(keylistId,
      transaction, 'acceptInviteRequest', inviterId);
    
    var keylist = that.getKeylist(keylistId)

    var publicEncryptionKey = that.serializePublicKey(
      that.getPublicEncryptionKey(keylistId));
    
    var publicSignatureKey = that.serializePublicKey(
      that.getPublicSignatureKey(keylistId));
    
    var inviteeKeypairsTxt = JSON.stringify({
      encryptionKeypair: { publicKey: publicEncryptionKey },
      signatureKeypair: { publicKey: publicSignatureKey }
    });
    
    var encryptedInviteeKeypairsBase64 = Crypto
      .encryptThenEncodeBase64(symKey, inviteeKeypairsTxt);
    
    //console.log(encryptedInviteeKeypairsBase64);

    return Crypto.encodeBase64(JSON.stringify({
      keylistId: inviteRequest.keylistId,
      inviterId: inviteRequest.inviterId,
      inviteeAlias: inviteRequest.inviteeAlias,
      inviteeId: that.userId, inviteePublicKey:
      that.serializePublicKey(inviteeKeypair.publicKey),
      encKeypairs: encryptedInviteeKeypairsBase64
    }));
    
  };
  
  that.confirmInviteRequest = function(inviteRequestBase64) {
    
    var inviteRequestTxt = Crypto.decodeBase64(inviteRequestBase64);
    var inviteRequest = JSON.parse(inviteRequestTxt);
    
    var keylistId = inviteRequest.keylistId;
    var inviteeId = inviteRequest.inviteeId;
    
    if (!inviteRequest.inviterId || !inviteRequest.inviteeId ||
        !inviteRequest.keylistId || !inviteRequest.inviteePublicKey ||
        !inviteRequest.encKeypairs)
      throw 'Missing required parameters.'
    
    if (inviteRequest.inviterId != that.userId )
      throw 'User not authorized for invite request.'
    
    var transaction = that.getTransaction(keylistId,
      'createInviteRequest', inviteRequest.inviteeAlias);
    
    var inviterPrivateKey = that.buildPrivateKey(
      transaction.inviterKeypair.privateKey, 'encryption');
    
    var inviteePublicKey = that.buildPublicKey(
      inviteRequest.inviteePublicKey, 'encryption');
    
    var symKey = Crypto.diffieHellman(inviterPrivateKey, inviteePublicKey);
    
    var inviteeKeypairsTxt = Crypto.decodeBase64ThenDecrypt(
      symKey, inviteRequest.encKeypairs);
    
    var inviteeKeypairsJson = JSON.parse(inviteeKeypairsTxt);

    var keylist = that.getKeylist(keylistId);
    var keylistJson = that.serializeKeylist(keylist, true);
    
    var keylistJsonTxt = JSON.stringify(keylistJson);
    
    that.addKeypairs(keylistId, inviteeId, inviteeKeypairsJson);
    
    var encKeylistJsonTxtBase64 = Crypto
      .encryptThenEncodeBase64(symKey, keylistJsonTxt);
    
    var inviteConfirmation = Crypto.encodeBase64(
      JSON.stringify({
        inviterId: inviteRequest.inviterId,
        inviteeId: inviteRequest.inviteeId,
        keylistId: inviteRequest.keylistId,
        encKeylist: encKeylistJsonTxtBase64
    }));
    
    var encInviteeKeypairBase64 = Crypto.encryptMessage(
      keylistId, inviteeKeypairsTxt);
      
    var addUserRequest = Crypto.encodeBase64(
      JSON.stringify({
        keylistId: keylistId,
        inviteeId: inviteRequest.inviteeId,
        inviteeKeypairs: encInviteeKeypairBase64
    }));
    
    return {
      inviteConfirmation: inviteConfirmation,
      addUserRequest: addUserRequest
    };

  };
  
  that.completeInviteRequest = function (inviteRequestBase64) {
    
    var inviteRequestTxt = Crypto.decodeBase64(inviteRequestBase64);
    var inviteRequest = JSON.parse(inviteRequestTxt);
    var keylistId = inviteRequest.keylistId;
    
    if (!inviteRequest.inviterId || !inviteRequest.inviteeId ||
        !inviteRequest.keylistId || !inviteRequest.encKeylist)
      throw 'Missing required parameters.';
    
    var transaction = that.getTransaction(keylistId, 
      'acceptInviteRequest', inviteRequest.inviterId);
    
    if (!transaction)
      throw 'Missing acceptInviteRequest transaction.'
    
    var keylistJson = JSON.parse(Crypto.decodeBase64ThenDecrypt(
      transaction.symKey, inviteRequest.encKeylist));
    
    for(userId in keylistJson) {
    
      var keypairsJson = keylistJson[userId];
      that.addKeypairs(keylistId, userId, keypairsJson);
      
    };
    
    return null;
    
  };
  
  that.addUserRequest = function (addUserRequestBase64) {
    
    var addUserRequestTxt = Crypto.decodeBase64(addUserRequestBase64);
    var addUserRequest = JSON.parse(addUserRequestTxt);
    
    var keylistId           = addUserRequest.keylistId,
        inviteeId           = addUserRequest.inviteeId,
        inviteeKeypairsJson = addUserRequest.inviteeKeypairs;
        
    if (!keylistId || !inviteeId || !inviteeKeypairsJson)
      throw 'Missing required parameters.'
    
    var inviteeKeypairsTxt = Crypto.decryptMessage(keylistId, inviteeKeypairsJson);
    
    that.addKeypairs(keylistId, inviteeId, JSON.parse(inviteeKeypairsTxt));
    
    return null;
    
  };
  
  if (encKeyfile) that.decryptKeyfile();
  
};