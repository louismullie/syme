Syme.Crypto = function (workerUrl) {

  var _this = this;

  this.locked         = false;
  this.onLockRelease  = [];
  
  this.lockRequirements = {
    
    // Keyfile-related methods
    updateKeyfileKey: true, 
    getEncryptedKeyfile: false,
    getSerializedKeyfile: false,

    // Keylist-related methods
    createKeylist: true,
    deleteKeylist: true,
    
    // Key transfer-related methods
    createInviteRequests: true,
    acceptInviteRequest: true,
    confirmInviteRequest: true,
    completeInviteRequest: true,
    transferKeysRequest: true,
    addUsersRequest: true,
    getKeyFingerprint: false,
    
    // Random generation-related methods
    generateRandomKeys: false,
    generateRandomHex: false,
    
    // Key derivation-related methods
    deriveKeys: false,
    
    // Encryption-related methods
    encryptMessage: false,
    decryptMessage: false,
    encryptMessageKeys: false,
    decryptMessageKey: false,
    decrypt: false
    
  };

  this.executeJob = function (jobType, args) {
    
    var args = [].slice.call(args);
    
    var needsLock = this.lockRequirements[jobType];
    
    if (args.length == 1) {
      var arguments = [];
    } else {
      var arguments = args.slice(0, args.length - 1);
    }
    
    if (needsLock === undefined)
      throw 'Lock requirement not defined.';
    
    var job = { method: jobType, params: arguments };
    
    var callback = args[args.length - 1];
    
    this._executeJob(needsLock, job, callback);
    
  };
  
  this._executeJob = function (needsLock, job, successCb) {
    
    var jobsQueued = (_this.onLockRelease.length != 0);
    
    // If there are no jobs queued, and we are 
    // not currently in a lock
    if (!jobsQueued && !_this.locked) {
    
      // No queue, no lock, no need for a lock:
      // just execute the job directly.
      if (!needsLock) {
        
        _this.workerPool.queueJob(job, successCb);
        
      // No queue, no lock, but need to start a lock:
      // wrap the callback with the lock function 
      // and execute the job immediately.
      } else {
        
        _this.queueWithLock(job, successCb);
        
      }
    
    // Either there is a job queued, or we are locked,
    // so push the job to the queue.
    }  else {

      _this.onLockRelease.push({
        lock: needsLock, job: job,
        success: successCb
      });

    }
    
    // If there are jobs queued, and we are not 
    // locked, execute the first job in the queue.
    if (jobsQueued && !this.locked) {

      var nextJob = _this.onLockRelease.shift();
      _this._executeJob(nextJob.lock, nextJob.job, nextJob.success);

    }

  };
  
  // Execute a job, retrieve the encrypted keyfile,
  // broadcast it for other workers to get the updates
  this.queueWithLock = function (job, successCb) {
    
    var _this = this;
    
    var worker = _this.workerPool.queueJob(job, function (data) {

      _this.lock = false;

      _this.workerPool.sendJob(worker,

        {
          id: Math.random()*Math.exp(40).toString(),
          method: 'getEncryptedKeyfile'
        }, function (encryptedKeyfile) {
          
          _this.workerPool.broadcastJob(
            {
              id: Math.random()*Math.exp(40).toString(),
              method: 'reinitializeKeyfile',
              params: [encryptedKeyfile]
            }, function () {
              successCb(data);
            });
            
      });

    });
    
  };
  
  
  // Wrapper for keyfile callback
  this.keyfileCallback =  function (args, wrapper) {
    
    var lastEl   = args.length - 1,
        callback = args[lastEl];
    
    args[lastEl] = function () {
      _this.getEncryptedKeyfile(callback);
    };
    
    return args;
    
  }
  
  /*
   * Keyfile-related methods
   */
  
  // Initialize the keyfile in WebWorker memory.
  this.initializeKeyfile = function (userId, password, encKeyfile, encryptedKeyfileCb) {

    var _this = this;

    Syme.Crypto.workerPool.broadcastJob({
      
      method: 'initializeKeyfile',
      params: [userId, password, encKeyfile]

    }, function () {
      _this.getEncryptedKeyfile(encryptedKeyfileCb);
    });

  };
  
  // getEncryptedKeyfile(callback)
  this.getEncryptedKeyfile = function () {
    this.executeJob('getEncryptedKeyfile', arguments);
  };
  
  // getSerializedKeyfile(callback)
  this.getSerializedKeyfile = function () {
    this.executeJob('getSerializedKeyfile', arguments);
  };
  
  /*
   * Update a keyfile's key.
   */
   this.updateKeyfileKey = function (key, encryptedKeyfileCb) {
     
     Syme.Crypto.workerPool.broadcastJob({

       method: 'updateKeyfileKey',
       params: [key]

     }, function () {
       _this.getEncryptedKeyfile(encryptedKeyfileCb);
     });

   };
  
  /* 
   * Keylist-related methods

  /*
   * Create a keylist in the keyfile
   */
  this.createKeylist = function () {
    var args = this.keyfileCallback(arguments);
    this.executeJob('createKeylist', args);
  };
  
  /* 
   * Delete a keylist in the keyfile
   */
  this.deleteKeylist = function () {
    var args = this.keyfileCallback(arguments);
    this.executeJob('deleteKeylist', args);
  };
  
  /*
  * Key transfer-related methods
  */

  // createInviteRequests(keylistId, userAliases, inviteCreatedCb)
  this.createInviteRequests = function () {
    this.executeJob('createInviteRequests', arguments);
  };

  // acceptInviteRequest(inviteRequest, inviteAcceptedCb)
  this.acceptInviteRequest = function () {
    this.executeJob('acceptInviteRequest', arguments);
  };

  // confirmInviteRequest(keylistId, inviteeId, inviteRequest, keysJson, inviteAcceptedCb)
  this.confirmInviteRequest = function () {
    this.executeJob('confirmInviteRequest', arguments);
  };
  
  this.recryptKeys = function (keylistId, inviteeId, keysJson, recryptedCb) {
    
    var _this = this;
    
    var numWorkers = 4;
    
    var posts = this.splitArray(keysJson.posts, numWorkers),
        uploads = this.splitArray(keysJson.uploads, numWorkers),
        distribute = this.splitArray(keysJson.distribute, numWorkers);

    var totalElements = _.size(posts) + _.size(uploads) +  _.size(distribute);
          
    
    var recryptedPosts = [],
        recryptedUploads = [],
        recryptedDistribute = [];

    var start = new Date().getTime();
    
    NProgress.start();
    
    var numElements = 0;
    
    var checkCounter = function () {
      
      numElements++;
      
      NProgress.set(numElements/totalElements);
     
      
      if (numElements == totalElements) {
        
        var recryptedKeys = $.base64.encode(
          JSON.stringify({
            posts: recryptedPosts,
            uploads: recryptedUploads,
            distribute: recryptedDistribute
          })
        );
        
        recryptedCb(recryptedKeys);
        
        var end = new Date().getTime();
        //console.log('ELAPSED: ' + ((end - start) / 1000).toString());
        
      }
        
    };
    
    _.each(posts, function (postsChunk, index) {
      
      _this.workerPool.sendJob(index, {
        id: Math.random()*Math.exp(40).toString(),
        method: 'recryptPosts',
        params: [keylistId, inviteeId, postsChunk]
      }, function (receivedPosts) {
        recryptedPosts = _.union(recryptedPosts, receivedPosts);
        checkCounter();
      })
      
    });
    
    _.each(uploads, function (uploadsChunk, index) {
      
      _this.workerPool.sendJob(index, {
        id: Math.random()*Math.exp(40).toString(),
        method: 'recryptResources',
        params: [keylistId, inviteeId, uploadsChunk]
      }, function (receivedUploads) {
        recryptedUploads = _.union(recryptedUploads, receivedUploads);
        checkCounter();
      })
      
    });

    _.each(distribute, function (distributeChunk, index) {
      
      _this.workerPool.sendJob(index, {
        id: Math.random()*Math.exp(40).toString(),
        method: 'recryptResources',
        params: [keylistId, inviteeId, distributeChunk]
      }, function (receivedDistribute) {
        recryptedDistribute = _.union(recryptedDistribute, receivedDistribute);
        checkCounter();
      })
      
    });
    
    return null;
    
  };
  
  this.splitArray = function (a, n) {
    var len = a.length,out = [], i = 0;
    while (i < len) {
        var size = Math.ceil((len - i) / n--);
        out.push(a.slice(i, i += size));
    }
    return out;
  };

  // completeInviteRequest(completeRequest, inviteCompletedCb)
  this.completeInviteRequest = function () {
    this.executeJob('completeInviteRequest', arguments); 
  };

  // transferKeysRequest(keylistId, userId, keys, transferKeysCb);
  this.transferKeysRequest = function() {
    this.executeJob('transferKeysRequest', arguments);
  };

  // addUsersRequest(addUsersRequest, addedUsersCb)
  this.addUsersRequest = function() {
    this.executeJob('addUsersRequest', arguments);
  };
  
  // getKeyFingerprint(keylistId, userAlias, userRole,
  // inviteePublicKey, keyFingerprintCb
  this.getKeyFingerprint = function () {
    this.executeJob('getKeyFingerprint', arguments);
  };
  
  /* 
   * Random generation methods
   */
   
  // generateRandomKeys() 
  this.generateRandomKeys = function() {
    _this.executeJob('generateRandomHex', arguments);
  };

  this.generateRandomHex = function() {
    _this.executeJob('generateRandomHex', arguments);
  };
  
  // Initialize each worker 
  this.seedRandom = function () {

    _this.workerPool.scatterJob({
      
      method: 'seedRandom',
      fn: _this.getRandomValues
      
    });

  };

  // Get random values from native sources of entropy
  this.getRandomValues = function () {

    var uint32Array = new Uint32Array(32);
    window.crypto.getRandomValues(uint32Array);
    
    var array = _.map(uint32Array,
      function (i) { return i });
    
    return [array];

  };
  
  
  /*
   * Key derivation methods
   */
  
   // deriveKeys(password, salt, bits, derivedKeysCb)
   this.deriveKeys = function() {
     if (Syme.Compatibility.inPhoneGap()) {
       this.Native.deriveKeys.apply(this.Native, arguments);
     } else {
       this.executeJob('deriveKeys', arguments);
     }
   };
  
  /*
   * File transfer-related methods
   */
  // uploadChunk(chunkInfo, uploadedChunkCb)
  this.uploadChunk = function () {
    this.executeJob('uploadChunk', arguments);
  };

  // downloadChunk(chunkInfo, downloadedChunkCb)
  this.downloadChunk = function () {
    this.executeJob('downloadChunk', arguments);
  };
  
  /*
   * Encryption-related methods
   */
   
  // encryptMessage(keylistId, message, encryptedMessageCb)
  this.encryptMessage = function() {
    if (Syme.Compatibility.inPhoneGap()) {
      Syme.Crypto.Native.encryptMessage.apply(Syme.Crypto.Native, arguments);
    } else {
      this.executeJob('encryptMessage', arguments);
    }
  };

  this.encryptMessageKeys = function () {
    this.executeJob('encryptMessageKeys', arguments);
  };
  
  // decryptMessage(keylistId, text, decryptedMessageCb)  /* TO REFACTOR */
  this.decryptMessage = function (keylistId, encryptedText, decryptedMessageCb) {

    // Check that keys exist for current user.
    var userId  = Syme.CurrentSession.getUserId(),
        message = JSON.parse($.base64.decode(encryptedText)),
        hash    = sjcl.codec.hex.fromBits(
                  sjcl.hash.sha256.hash(encryptedText));

    // If cache fails, rescue and download file
    if (Syme.Cache.contains(hash)) {
      try {
        return decryptedMessageCb(Syme.Cache.get(hash));
      } catch (e) { }
    }
    
    // Return error message to callback if they don't
    if (message.keys[userId] == undefined)
      decryptedMessageCb('There was a problem with the decryption');

    var callback = function(decryptedText){

      // Retrieve the new key and reload if key is missing.
      if (decryptedText.error && decryptedText.error.missingKey)
        return _this.getMissingKey( decryptedText.error.missingKey );

      Syme.Cache.store(hash, decryptedText);

      decryptedMessageCb(decryptedText);

    };
    
    if (Syme.Compatibility.inPhoneGap()) {

      var args = [keylistId, encryptedText, callback];
      Syme.Crypto.Native.decryptMessage.apply(Syme.Crypto.Native, args);
      
    } else {
      
      Syme.Crypto._executeJob(false, {

        method: 'decryptMessage',
        params: [keylistId, encryptedText]

      }, callback);
      
    }

  };
  
  // decrypt(key, content, callback)
  this.decrypt = function () { this.executeJob('decrypt', arguments); };
  this.decryptMessageKey = function () { this.executeJob('decryptMessageKey', arguments); };
  
  this.getMissingKey = function (missingKey) {

    var baseUrl       = Syme.Url.fromGroup(missingKey.groupId),
        missingKeyUrl = Syme.Url.join(baseUrl, 'invitations', missingKey.userId);

    $.encryptedAjax(missingKeyUrl, {

      type: 'GET',

      success: function (addUserRequest) {

        var user = Syme.CurrentSession.getUser();
        user.addUsersRequest([addUserRequest], function () {
          return Syme.Router.reload();
        });

      }

    });

  };
  
  /*
   * Initialization of Crypto
   */
  
  // Create the worker pool
  this.workerPool = new WorkerPool2(workerUrl, 4);

  // Add some initial entropy to the PRNG
  this.seedRandom();

  // Add some entropy every minute
  setInterval(this.seedRandom, 60000);

};

// Initialize an instance of Crypto
Syme.Crypto = new Syme.Crypto(Syme.Settings.appWorkerPath);

Syme.Crypto.Native = {
  
	deriveKeys: function (data, salt, bits, kdf, callback) {

    Syme.Crypto.Native.scrypt(data, salt, function (key) {
      
      var key1 = key.slice(0, key.length / 2);
      var key2 = key.slice(key.length / 2, key.length);

      callback({ key1: key1, key2: key2 });
      
    });
    
  },
  
  decryptMessage: function (keylistId, messageTxt64, callback) {
    
    // Base-64 decode and JSON-parse the received message.
    var messageTxt = atob(messageTxt64);
    var messageJson = JSON.parse(messageTxt);
    
    var encMessage = messageJson.message;
    
    if (!encMessage || encMessage == '')
      throw 'Message is missing.';
      
    var encSymKeyTxt64 = messageJson.keys[
      Syme.CurrentSession.getUserId()];
    
    if (!encSymKeyTxt64 || encSymKeyTxt64 == '') {
      return 'Key is missing.';
    }
    
    Syme.Crypto.decryptMessageKey(keylistId, encSymKeyTxt64, function (decryptedSymKey) {
      
      if (decryptedSymKey.missingKey) callback({ error: decryptedSymKey });
      Syme.Crypto.Native.sjcl_decrypt(decryptedSymKey, messageJson.message, callback);
      
    });
    

  },
  
  encryptMessage: function (keylistId, message, callback) {
    
    Syme.Crypto.generateRandomHex(256, function (symKey) {
      
      Syme.Crypto.encryptMessageKeys(keylistId, message, symKey, function (encryptedKeys) {

        Syme.Crypto.Native.sjcl_encrypt(symKey, message, function (encryptedMessage) {

          var messageJson = { message: encryptedMessage, keys: encryptedKeys  };

          callback(btoa(JSON.stringify(messageJson)));

        });


      });
    
    });
  
  },
  
  sjcl_encrypt: function(key, data, callback) {
    cordova.exec(callback,
      function(err) { console.log("ERR:" + err); },
      "NativeCrypto",
      "sjcl_encrypt",
      [key, data]
    );
  },

  sjcl_decrypt: function(key, data, callback) {
    cordova.exec(callback,
      function(err) { console.log("ERR:" + err); },
      "NativeCrypto",
      "sjcl_decrypt",
      [key, data]
    );
  },

  scrypt: function(password, salt, callback) {
    cordova.exec(callback,
      function(err) { console.log("ERR:" + err); },
      "NativeCrypto",
      "scrypt",
      [password, salt]
    );
  }
  
};