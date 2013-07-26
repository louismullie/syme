importScripts('pakdh-client.js');

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

    _.each(keyfileJson, function (keylistJson, keylistId) {

       keyfile[keylistId] = that.buildKeylist(keylistJson);

    });
    
    this.keyfile = keyfile;
    
    return null;
    
  };
  
  that.buildKeylist = function (keylistJson) {
    
    var keylist = {};
    
    _.each(keylistJson, function (keypairs, userId) {

      if (userId != '_transactions')
        var keypairs = that.buildKeypairs(keypairs);
      
      keylist[userId] = keypairs;

    });
    
    return keylist;
    
  };
  
  that.buildKeypairs = function(keypairsJson) {
    
    if (!keypairsJson.encryptionKeypair)
      throw 'Encryption key(s) missing.';
    
    if (!keypairsJson.signatureKeypair)
      throw 'Signature key(s) missing.'
    
    var encryptionKeypair = that.buildKeypair(
      keypairsJson.encryptionKeypair, 'encryption');
    
    var signatureKeypair = that.buildKeypair(
      keypairsJson.signatureKeypair, 'signature');
    
    var keypairs = {
      encryptionKeypair: encryptionKeypair, 
      signatureKeypair: signatureKeypair
    };
    
    return keypairs;
    
  };
  
  that.buildKeypair = function(keypairJson, type) {
    
    if (!type)
      throw 'Keypair type is missing';
    
    if (!keypairJson.publicKey)
      throw 'Public key is missing.'
      
    var publicKey = that.buildPublicKey(
      keypairJson.publicKey, type);
      
    var keypair = { publicKey: publicKey };
    
    if (keypairJson.privateKey) {
      keypair.privateKey = that.buildPrivateKey(
        keypairJson.privateKey, type);
    }
    
    return keypair;
    
  };
  
  that.buildPublicKey = function (pubJson, type ) {
    
    var keyType = that.getKeyType(type);

    var point = sjcl.ecc.curves["c" + pubJson.curve]
      .fromBits(pubJson.point);

    var publicKey = new keyType.publicKey(
        pubJson.curve, point.curve, point);

    return publicKey;
    
  },

  that.buildPrivateKey = function (privJson, type) {

    var keyType = that.getKeyType(type);
    
    var exponent = sjcl.bn.fromBits(privJson.exponent);

    var curve = "c" + privJson.curve;
    
    var privateKey = new keyType.secretKey(
        privJson.curve, sjcl.ecc.curves[curve], exponent);

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
    
    var keypair = sjcl.ecc.elGamal.generateKeys(384, 1);
    
    return { publicKey: keypair.pub, privateKey: keypair.sec };
    
  };
  
  that.generateSignatureKeypair = function () {
    
    var keypair = sjcl.ecc.ecdsa.generateKeys(384, 1);
    
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
    
    that.keyfile[keylistId][userId] = keypairs;
    
    return null;
      
  };
  
  that.getPublicSignatureKey = function(groupId, userId) {
    
    var keylist = this.getKeylist(groupId);
    var userId = userId || that.userId;
    
    if (!keylist[userId] || !keylist[userId].signatureKeypair ||
        !keylist[userId].signatureKeypair.publicKey)
      return { missingKey: { userId: userId, groupId: groupId }  };
    
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
  
  that.getPrivateSignatureKey = function(groupId) {
    
    var keylist = this.getKeylist(groupId);
    
    if (!keylist[that.userId] ||
        !keylist[that.userId].signatureKeypair ||
        !keylist[that.userId].signatureKeypair.privateKey)
      throw 'Private key not initialized.'
  
    return keylist[that.userId].signatureKeypair.privateKey;
    
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
  
  that.createInviteRequests = function (keylistId, inviteeAliases) {
    
    var inviteRequests = [];
    
    _.each(inviteeAliases, function (inviteeAlias) {
      var request = that.createInviteRequest(keylistId, inviteeAlias);
      inviteRequests.push({ alias: inviteeAlias, request: request });
    });
    
    return inviteRequests;
    
  };
  
  that.createInviteRequest = function (keylistId, inviteeAlias) {
    
    var keylist = that.getKeylist(keylistId);
    var invitationToken = Crypto.generateRandomHex(8);
    
    var inviterId = that.userId;
    
    // PAK-DH step 1.
    var pakdh = new PAKDHClient(invitationToken);
    var gRa = pakdh.generategRa();
    
    var X = pakdh.calculateX(inviterId, inviteeAlias, gRa);
    var keypair = that.generateEncryptionKeypair();
    var keypairJson = that.serializeKeypair(keypair);
    
    var transaction = {
      inviteeAlias: inviteeAlias,
      inviterKeypair: keypairJson,
      inviterExponent: gRa.toString(16),
      invitationToken: invitationToken
    };
    
    var inviterPublicKey = that.serializePublicKey(keypair.publicKey);
    
    that.createTransaction(keylistId,
      transaction, 'createInviteRequest', inviteeAlias);
     
    var inviteRequest = {
      keylistId: keylistId,
      inviterId: inviterId,
      inviteeAlias: inviteeAlias,
      inviterPublicKey: inviterPublicKey,
      inviterX: X.toString(16)
    };
    
    return [Crypto.encodeBase64(JSON.stringify(inviteRequest)), invitationToken];
    
  };
  
  that.acceptInviteRequest = function(inviteRequestBase64, invitationToken) {
    
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
    
    var pakdh = new PAKDHClient(invitationToken);
    
    var gRb = pakdh.generategRb();
    
    var Xab = pakdh.calculateXab(inviterId,
      inviteRequest.inviteeAlias,
      new BigInteger(inviteRequest.inviterX, 16));
    
    var Y = pakdh.calculateY(inviterId,
      inviteRequest.inviteeAlias, gRb);
    
    var S1 = pakdh.calculateS1(inviterId,
      inviteRequest.inviteeAlias, Xab, gRb);
    
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
      inviteeExponent: gRb.toString(16),
      inviterXab: Xab.toString(16),
      invitationToken: invitationToken
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
    
    return Crypto.encodeBase64(JSON.stringify({
      keylistId: inviteRequest.keylistId,
      inviterId: inviteRequest.inviterId,
      inviteeAlias: inviteRequest.inviteeAlias,
      inviteeId: that.userId, inviteePublicKey:
      that.serializePublicKey(inviteeKeypair.publicKey),
      inviteeS1: S1.toString(16),
      inviteeY: Y.toString(16),
      encKeypairs: encryptedInviteeKeypairsBase64
    }));
    
  };
  
  that.confirmInviteRequest = function(inviteRequestBase64) {
    
    var inviteRequestTxt = Crypto.decodeBase64(inviteRequestBase64);
    var inviteRequest = JSON.parse(inviteRequestTxt);
    
    var keylistId = inviteRequest.keylistId;
    var inviteeId = inviteRequest.inviteeId;
    var inviterId = inviteRequest.inviterId;
    var inviteeAlias = inviteRequest.inviteeAlias;
    
    var inviteeY = inviteRequest.inviteeY;
    
    if (!inviterId || !inviteeId || !inviteeAlias ||
        !keylistId || !inviteRequest.inviteePublicKey ||
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
    
    var pakdh = new PAKDHClient(transaction.invitationToken);
    
    var gRa = new BigInteger(transaction.inviterExponent, 16);
    
    var Yba = pakdh.calculateYba(inviterId, inviteeAlias,
      new BigInteger(inviteeY, 16));
      
    var S1p = pakdh.calculateS1(inviterId, inviteeAlias, gRa, Yba);

    if (S1p.toString(16) != inviteRequest.inviteeS1)
      return { error: 'invalid_s1' };
    
    // Upgrade invitee alias to invitee ID.
    var S2 = pakdh.calculateS2(inviterId, inviteeId, gRa, Yba);
    var symKey = pakdh.calculateK(inviterId, inviteeId, gRa, Yba);
    
    var encKeylistJsonTxtBase64 = Crypto
      .encryptThenEncodeBase64(symKey.toString(16), keylistJsonTxt);
    
    var inviteConfirmation = Crypto.encodeBase64(
      JSON.stringify({
        inviterId: inviteRequest.inviterId,
        inviteeId: inviteRequest.inviteeId,
        keylistId: inviteRequest.keylistId,
        encKeylist: encKeylistJsonTxtBase64,
        inviterS2: S2.toString(16)
    }));
    
    var encInviteeKeypairBase64 = Crypto.encryptMessage(
      keylistId, inviteeKeypairsTxt);
    
    var addUserRequest = Crypto.encodeBase64(
      JSON.stringify({
        keylistId: keylistId,
        inviterId: inviteRequest.inviterId,
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
    var inviterId = inviteRequest.inviterId;
    var inviteeId = inviteRequest.inviteeId;
    var keylistId = inviteRequest.keylistId;
    
    if (!inviterId || !inviteeId ||
        !inviteRequest.keylistId || !inviteRequest.encKeylist)
      throw 'Missing required parameters.';
    
    var transaction = that.getTransaction(keylistId, 
      'acceptInviteRequest', inviteRequest.inviterId);
    
    var pakdh = new PAKDHClient(transaction.invitationToken);
    
    var exponent = new BigInteger(transaction.inviteeExponent, 16);
    var Xab = new BigInteger(transaction.inviterXab, 16);
    var gRb = new BigInteger(transaction.inviteeExponent, 16);

    var S2p = pakdh.calculateS2(inviterId, inviteeId, Xab, gRb);
    
    if (S2p.toString(16) !== inviteRequest.inviterS2)
      throw 'Unsafe - invalid S2.';
    
    var symKey = pakdh.calculateK(inviterId, inviteeId, Xab, gRb);
    
    if (!transaction)
      throw 'Missing acceptInviteRequest transaction.'
    
    var keylistJson = JSON.parse(Crypto.decodeBase64ThenDecrypt(
        symKey.toString(16), inviteRequest.encKeylist));
    
    for(userId in keylistJson) {
    
      var keypairsJson = keylistJson[userId];
      
      if (userId == that.userId) continue;
      
      that.addKeypairs(keylistId, userId, keypairsJson);
      
    };
    
    return null;
    
  };
  
  that.addUserRequest = function (addUserRequestBase64) {
    
    var addUserRequestTxt = Crypto.decodeBase64(addUserRequestBase64);
    var addUserRequest = JSON.parse(addUserRequestTxt);

    var keylistId           = addUserRequest.keylistId,
        inviteeId           = addUserRequest.inviteeId,
        inviteeKeypairs     = addUserRequest.inviteeKeypairs;

    if (!keylistId || !inviteeId || !inviteeKeypairs)
      throw 'Missing required parameters.'
    
    var inviteeKeypairsTxt = Crypto.decryptMessage(keylistId, inviteeKeypairs);

    that.addKeypairs(keylistId, inviteeId, JSON.parse(inviteeKeypairsTxt));

    return keylistId;
    
  };
  
  if (encKeyfile) that.decryptKeyfile();
  
};