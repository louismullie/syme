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
  
  this.getEncryptedKeyfile = function (userId, encryptedKeyfileCb) {
    
    Crypto.workerPool.queueJob({
      
      method: 'getEncryptedKeyfile'
    
    // Return encrypted keyfile.
    }, function (message) {
      encryptedKeyfileCb(message.result);
    });
    
  };
  
  this.generateKeylist = function (keylistId, password, encryptedKeyfileCb) {
    
    // Generate keylist for group.
    Crypto.workerPool.queueJob({
      
      method: 'generateKeylist',
      params: [keylistId]
    
    // Get encrypted keyfile.
    }, function () {
    
    Crypto.workerPool.queueJob({
      
      method: 'getEncryptedKeyfile',
      params: [password]
    
    // Return encrypted keyfile.
    }, function (response) {
      
      // Crypto.workerPool.broadcast(keyfile)
      alert(response.result)
    
    }); });
    
  };
  
  this.addKeypairsToKeylist = function (keylistId, userId, keypairs, password, encryptedKeyfileCb) {
    Crypto.workerPool.queueJob({
      
      method: 'addKeypairsToKeylist',
      params: [keylistId, userId, keypairs]
    
    // Get encrypted keyfile.
    }, function (response) {
       
    Crypto.workerPool.queueJob({

      method: 'getEncryptedKeyfile',
      params: [password]

    // Return encrypted keyfile.
    }, function (response) {

      alert(response.result)

    }); });
  };
  
  this.initializeKeyfile = function (userId, password, encKeyfile, doneCallback) {
    
    // Broadcast the public keyfile.
    Crypto.workerPool.queueJob({
      
      method: 'initializeKeyfile',
      params: [userId, password, encKeyfile]
      
    }, doneCallback);

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