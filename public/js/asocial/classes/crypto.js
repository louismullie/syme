Crypto = function (workerUrl) {
  
  var _this = this;
  
  this.queueJob = function (job, successCb, errorCb) {
    
    if (asocial.compat.inPhoneGap()) {
      cordova.exec(successCb, errorCb, 'Crypto',
        job.method, job.params);
    } else {
      this.workerPool.queueJob(job, successCb);
    }
    
  };
  
  this.getEncryptedKeyfile = function (encryptedKeyfileCb) {
    
    console.log(1);
    Crypto.workerPool.queueJob({
      method: 'getEncryptedKeyfile'
    }, function (message) {
      encryptedKeyfileCb(message);
    });
    
  };
  
  // Development only!
  this.getSerializedKeyfile = function (keyfileCb) {
    
    Crypto.workerPool.queueJob({
      
      method: 'getSerializedKeyfile'
    
    // Return encrypted keyfile.
    }, keyfileCb);
    
  };
  
  this.createKeylist = function (keylistId, encryptedKeyfileCb) {
    
    var _this = this;
    
    // Generate keylist for group.
    Crypto.workerPool.queueJob({
      
      method: 'createKeylist',
      params: [keylistId]
    
    // Get encrypted keyfile.
    }, function () {
      _this.getEncryptedKeyfile(encryptedKeyfileCb);
    });
    
  };
  
  this.deleteKeylist = function (keylistId, encryptedKeyfileCb) {
    
    var _this = this;
    
    // Delete a keylist.
    Crypto.workerPool.queueJob({
      
      method: 'deleteKeylist',
      params: [keylistId]
    
    // Get encrypted keyfile.
    }, function () {
      _this.getEncryptedKeyfile(encryptedKeyfileCb);
    });
    
  };
  
  this.createInviteRequest = function (keylistId, userAlias, inviteCreatedCb) {
    
    Crypto.workerPool.queueJob({
      
      method: 'createInviteRequest',
      params: [keylistId, userAlias]
      
    }, inviteCreatedCb);
    
  };
 
  this.acceptInviteRequest = function (inviteRequest, inviteAcceptedCb) {

    Crypto.workerPool.queueJob({
      
      method: 'acceptInviteRequest',
      params: [inviteRequest]
      
    }, inviteAcceptedCb);
    
  };
  
  this.confirmInviteRequest = function (inviteRequest, inviteAcceptedCb) {

    Crypto.workerPool.queueJob({
      
      method: 'confirmInviteRequest',
      params: [inviteRequest]
      
    }, inviteAcceptedCb);
    
  };
  
  this.completeInviteRequest = function (completeRequest, inviteCompletedCb) {

    Crypto.workerPool.queueJob({
      
      method: 'completeInviteRequest',
      params: [completeRequest]
      
    }, inviteCompletedCb);
    
  };
  
  this.transferKeysRequest = function(keylistId, userId, keys, transferKeysCb) {
    
    Crypto.workerPool.queueJob({
      
      method: 'transferKeysRequest',
      params: [keylistId, userId, keys]
      
    }, transferKeysCb);
    
  };
  
  this.addKeypairs = function (keylistId, userId, keypairs) {
    
    Crypto.workerPool.queueJob({
      
      method: 'addKeypairs',
      params: [keylistId, userId, keypairs]
      
    });
    
  };
  
  this.initializeKeyfile = function (userId, password, encKeyfile, encryptedKeyfileCb) {
    
    var _this = this;
    
    Crypto.workerPool.queueJob({
      
      method: 'initializeKeyfile',
      params: [userId, password, encKeyfile]
      
    }, function () {
      
      _this.getEncryptedKeyfile(encryptedKeyfileCb);
      
    });
    
    Crypto.workerPool.broadcastJob({
      
      method: 'initializeKeyfile',
      params: [userId, password, encKeyfile]
      
    }, function () {
      console.log(4);
      _this.getEncryptedKeyfile(encryptedKeyfileCb);
    });

  };
  
  this.encryptMessage = function(keylistId, message, encryptedMessageCb) {
    
    Crypto.workerPool.queueJob({
      
      method: 'encryptMessage',
      params: [keylistId, message]
      
    }, encryptedMessageCb);
    
  };
  
  this.decryptMessage = function (keylistId, message, decryptedMessageCb) {
    
    Crypto.workerPool.queueJob({
      
      method: 'decryptMessage',
      params: [keylistId, message]
      
    }, decryptedMessageCb);
    
  };
  
  this.uploadChunk = function (chunkInfo, uploadedChunkCb) {
    
    Crypto.workerPool.queueJob(chunkInfo, uploadedChunkCb);
    
  };

  this.downloadChunk = function (chunkInfo, downloadedChunkCb) {
    
    Crypto.workerPool.queueJob(chunkInfo, downloadedChunkCb);
    
  };
  
  this.generateRandomKeys = function(generatedKeysCb) {
    
    Crypto.workerPool.queueJob({
      
      method: 'generateRandomHex',
      params: [256]
      
    }, generatedKeysCb);
    
  };
  
  this.seedRandom = function () {
    
    var array = new Uint32Array(32);
    window.crypto.getRandomValues(array);
    array = _.map(array, function (i) { return i });
    
    _this.workerPool.broadcastJob({
      method: 'seedRandom', params: [array] });
    
  };
  
  this.debug = function (result) {
    alert(result);
  };
  
  this.workerPool = new WorkerPool2(workerUrl, 1);
 
  // Add some initial entropy to the PRNG.
  this.seedRandom();
  
  // Add some entropy every minute.
  setInterval(this.seedRandom, 60000);

};

Crypto = new Crypto('js/asocial/workers/asocial.js');