Crypto = function (workerUrl) {
  
  var _this = this;
  var callbacks = 
  
  this.generateKeyfile = function (userId, password, encryptedKeyfileCb) {
    
    // Generate initial keyfile.
    Crypto.workerPool.queueJob({
      
      method: 'generateKeyfile',
      params: [userId, password]
    
    // Generate keylist for group.
    }, function () {
      
    Crypto.workerPool.queueJob({
      
      method: 'getEncryptedKeyfile',
      params: [password]
    
    // Return encrypted keyfile.
    }, function (response) {
      
      encryptedKeyfileCb(response.result);

    }); });
    
  };
  
  this.generateKeylist = function (keylistId, password, encryptedKeyfileCb) {
    
    // Generate keylist for group.
    Crypto.workerPool.queueJob({
      
      method: 'generateKeylist',
      params: [keylistId]
    
    // Get encrypted keylist.
    }, function () {
    
    Crypto.workerPool.queueJob({
      
      method: 'getEncryptedKeyfile',
      params: [password]
    
    // Return encrypted keyfile.
    }, function (response) {
      
      // Crypto.workerPool.broadcast(keyfile)
      encryptedKeyfileCb(response.result)
    
    }); });
    
  };
  
  this.decryptKeyfile = function (keyfile, userId, password, doneCallback) {
    
    // Broadcast the public keyfile.
    Crypto.workerPool.queueJob({
      
      method: 'decryptKeyfile',
      params: [keyfile, password, userId]
      
    }, doneCallback);
    
  };
  
  this.initializeKeyfile = function (keyfile, password, userId, doneCallback) {
    
    if (keyfile) {
      this.decryptKeyfile(keyfile, userId, password, doneCallback);
    } else {
      this.generateKeyfile(userId, password, doneCallback);
    }
    
    return null;
    
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