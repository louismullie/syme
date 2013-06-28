Crypto = function (workerUrl) {
  
  var _this = this;
  var callbacks = 
  
  this.queueJob = function (job, successCb, errorCb) {
    
    if (asocial.compat.inPhoneGap()) {
      cordova.exec(successCb, errorCb, 'Crypto',
        job.method, job.params);
    } else {
      this.workerPool.queueJob(job, successCb);
    }
    
  };
  
  this.getEncryptedKeyfile = function (encryptedKeyfileCb) {
    
    Crypto.workerPool.queueJob({
      
      method: 'getEncryptedKeyfile'
    
    // Return encrypted keyfile.
    }, function (message) {
      encryptedKeyfileCb(message.result);
    });
    
  };
  
  this.createKeylist = function (keylistId, doneCallback) {
    
    // Generate keylist for group.
    Crypto.workerPool.queueJob({
      
      method: 'createKeylist',
      params: [keylistId]
    
    // Get encrypted keyfile.
    }, doneCallback);
    
  };
  
  this.addKeypairs = function (keylistId, userId, keypairs) {
    
    Crypto.workerPool.queueJob({
      
      method: 'addKeypairs',
      params: [keylistId, userId, keypairs]
      
    });
    
  };
  
  this.initializeKeyfile = function (userId, password, encKeyfile, doneCallback) {
    
    Crypto.workerPool.queueJob({
      
      method: 'initializeKeyfile',
      params: [userId, password, encKeyfile]
      
    }, doneCallback);

  };
  
  this.encryptMessage = function(keylistId, message, encryptedMessageCb) {
    
    Crypto.workerPool.queueJob({
      
      method: 'encryptMessage',
      params: [keylistId, message]
      
    }, function (response) {
      encryptedMessageCb(response.result);
    });
    
  };
  
  this.decryptMessage = function (keylistId, message, decryptedMessageCb) {
    
    Crypto.workerPool.queueJob({
      
      method: 'decryptMessage',
      params: [keylistId, message]
      
    }, function (response) {
      decryptedMessageCb(response.result);
    });
    
  };
  
  this.seedRandom = function () {
    
    var array = new Uint32Array(32);
    window.crypto.getRandomValues(array);
    array = _.map(array, function (i) { return i });
    
    _this.workerPool.queueJob({
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

// Crypto.initializeKeyfile('louis', 'password');
// Crypto.createKeylist('bruncheurs');
// Crypto.getEncryptedKeyfile('louis', alert);