Keyfile = function(keyfile, currentUserId) {
  
  var that = this;
  
  that.keyfile = keyfile;
  that.currentUserId = currentUserId;
  
  that.createKeylist = function (keylistId, currentUserKeypair) {
    that.keyfile[keylistId] = {};
    that.keyfile[keylistId][that.currentUserId] = currentUserKeypair;
  };
  
  that.publicSignatureKey = function(groupId, userId) {
    
    var typeCallback = that.signatureKeypairForUser;
    var keypair = that.getKeypair(groupId, userId, typeCallback);
  
    return keypair.publicKey;
    
  };
  
  that.publicEncryptionKey = function(groupId, userId) {
    
    var typeCallback = that.encryptionKeypairForUser;
    var keypair = that.getKeypair(groupId, userId, typeCallback);
  
    return keypair.publicKey;
    
  };
  
  that.privateSignatureKey = function(groupId) {
    
    var typeCallback = that.signatureKeypairForUser;
    var keypair = that.getKeypair(groupId, currentUserId, typeCallback);
  
    if (!keypair.privateKey) throw 'Private key does not exist..'
  
    return keypair.privateKey;
    
  };
  
  that.privateEncryptionKey = function(groupId) {
    
    var typeCallback = that.encryptionKeypairForUser;
    var keypair = that.getKeypair(groupId, currentUserId, typeCallback);
  
    if (!keypair.privateKey) throw 'Private key does not exist.'
  
    return keypair.privateKey;
    
  };
  
  that.getKeypair = function (groupId, userId, typeCallback) {
    
    var userId = userId || that.currentUserId;
    var keylist = that.keylistForGroup(groupId);
    
    return typeCallback(keylist, userId);
    
  };
  
  that.keylistForGroup = function (groupId) {
    
    var keylist = that.keyfile[groupId];
    if (!keylist) throw 'Group does not exist.'
    
    return keylist;
    
  };
  
  that.keypairsForUser = function (keylist, userId) {
    
    var keypairs = keylist[userId];
    
    if (!keypairs)  throw 'User does not exist.'
    
    if (!keypairs.encryptionKeypair)
      throw 'Encryption keypair does not exist.'
      
    if (!keypairs.signatureKeypair)
      throw 'Signature keypair does not exist.'
    
    return keypairs;
    
  };
  
  // Type is 'encryptionKeypair' or 'signatureKeypair'
  that.keypairForUser = function(keylist, userId, type) {
    
    var keypairs = that.keypairsForUser(keylist, userId)
    var keypair = keypairs[type];
    
    if (!keypair.publicKey)
      throw 'Public key does not exist.'
    
    return keypair;
    
  };
  
  that.encryptionKeypairForUser = function(keylist, userId) {
    
    return that.keypairForUser(keylist, userId, 'encryptionKeypair');
    
  };
  
  that.signatureKeypairForUser = function(keylist, userId) {
    
    return that.keypairForUser(keylist, userId, 'signatureKeypair');
    
  };
  
};