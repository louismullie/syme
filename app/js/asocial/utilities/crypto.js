Crypto = function (workerUrl) {

  var _this = this;
  
  this.locked = false;

  this.onLockRelease = [];

  this.executeJobWithLock = function (job, successCb) {
    
    var successCb = successCb || function () {};
    this.executeJob(true, job, successCb);

  };

  this.executeJobWithoutLock = function (job, successCb) {

    var successCb = successCb || function () {};
    this.executeJob(false, job, successCb);

  };

  this.executeJob = function (needsLock, job, successCb) {

    var jobsQueued = (_this.onLockRelease.length != 0);

    if (jobsQueued) {

      if (_this.locked) {

        if (needsLock) {

          _this.onLockRelease.push({
            lock: true, job: job,
            success: successCb
          });

        } else {

          _this.onLockRelease.push({
            lock: false, job: job,
            success: successCb
          });

        } // needsLock

     } else { // _this.locked

        var nextJob = _this.onLockRelease.shift();

        if (needsLock) {

          _this.onLockRelease.push({
            lock: true, job: job,
            success: successCb
          });

        } else {

          _this.onLockRelease.push({
            lock: false, job: job,
            success: successCb
          });

        } // needsLock

        _this.executeJob(nextJob.lock, nextJob.job, nextJob.success);

      } // _this.locked

    } else { // jobsQueued

      if (_this.locked) {

        if (needsLock) {

          _this.onLockRelease.push({
            lock: true, job: job,
            success: successCb
          });

        } else {

          _this.onLockRelease.push({
            lock: false, job: job,
            success: successCb
          });

        }

      } else {

        if (needsLock) {

          var worker = _this.workerPool.queueJob(job,

            function (data) {

              //alert('Locking for ' + JSON.stringify(job));
              _this.lock = false;

              _this.workerPool.sendJob(worker,

                {
                  id: Math.random()*Math.exp(40).toString(),
                  method: 'getEncryptedKeyfile'
                }, function (encryptedKeyfile) {
                  //alert('Reinitializing');
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

        } else {

          _this.workerPool.queueJob(job, successCb);
        }

      }

    }

  };

  this.getEncryptedKeyfile = function (encryptedKeyfileCb) {

    Crypto.executeJobWithoutLock({
      method: 'getEncryptedKeyfile'
    }, function (message) {
      encryptedKeyfileCb(message);
    });

  };

  // Development only!
  this.getSerializedKeyfile = function (keyfileCb) {

    Crypto.executeJobWithoutLock({

      method: 'getSerializedKeyfile'

    // Return encrypted keyfile.
    }, keyfileCb);

  };

  this.createKeylist = function (keylistId, encryptedKeyfileCb) {

    var _this = this;

    // Generate keylist for group.
    Crypto.executeJobWithLock({

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
    Crypto.executeJobWithLock({

      method: 'deleteKeylist',
      params: [keylistId]

    // Get encrypted keyfile.
    }, function () {
      _this.getEncryptedKeyfile(encryptedKeyfileCb);
    });

  };

  this.createInviteRequests = function (keylistId, userAliases, inviteCreatedCb) {

    Crypto.executeJobWithLock({

      method: 'createInviteRequests',
      params: [keylistId, userAliases]

    }, inviteCreatedCb);

  };

  this.acceptInviteRequest = function (inviteRequest, token, inviteAcceptedCb) {

    Crypto.executeJobWithLock({

      method: 'acceptInviteRequest',
      params: [inviteRequest, token]

    }, inviteAcceptedCb);

  };

  this.confirmInviteRequest = function (keylistId, inviteeId, inviteRequest, keysJson, inviteAcceptedCb) {

    Crypto.executeJobWithLock({

      method: 'confirmInviteRequest',
      params: [keylistId, inviteeId, inviteRequest, keysJson]

    }, inviteAcceptedCb);

  };

  this.completeInviteRequest = function (completeRequest, inviteCompletedCb) {

    Crypto.executeJobWithLock({

      method: 'completeInviteRequest',
      params: [completeRequest]

    }, inviteCompletedCb);

  };

  this.transferKeysRequest = function(keylistId, userId, keys, transferKeysCb) {

    Crypto.executeJobWithLock({

      method: 'transferKeysRequest',
      params: [keylistId, userId, keys]

    }, transferKeysCb);

  };

  this.addUsersRequest = function(addUsersRequest, addedUsersCb) {

    Crypto.executeJobWithLock({

      method: 'addUsersRequest',
      params: [addUsersRequest]

    }, addedUsersCb);

  };

  this.initializeKeyfile = function (userId, password, encKeyfile, encryptedKeyfileCb) {

    var _this = this;

    Crypto.workerPool.broadcastJob({

      method: 'initializeKeyfile',
      params: [userId, password, encKeyfile]

    }, function () {
      _this.getEncryptedKeyfile(encryptedKeyfileCb);
    });

  };

  this.encryptMessage = function(keylistId, message, encryptedMessageCb) {

    Crypto.executeJobWithoutLock({

      method: 'encryptMessage',
      params: [keylistId, message]

    }, encryptedMessageCb);

  };

  this.decryptMessage = function (keylistId, message, decryptedMessageCb) {

    Crypto.executeJobWithoutLock({

      method: 'decryptMessage',
      params: [keylistId, message]

    }, decryptedMessageCb);

  };

  this.uploadChunk = function (chunkInfo, uploadedChunkCb) {

    Crypto.executeJobWithoutLock(chunkInfo, uploadedChunkCb);

  };

  this.downloadChunk = function (chunkInfo, downloadedChunkCb) {

    Crypto.executeJobWithoutLock(chunkInfo, downloadedChunkCb);

  };

  this.generateRandomKeys = function(generatedKeysCb) {

    Crypto.executeJobWithoutLock({

      method: 'generateRandomHex',
      params: [256]

    }, generatedKeysCb);

  };
  
  this.deriveKeys = function(password, salt, generatedKeysCb) {

    Crypto.executeJobWithoutLock({

      method: 'deriveKeys',
      params: [password, salt]

    }, generatedKeysCb);

  };
  
  this.getInvitationToken = function (keylistId, userAlias, invitationTokenCb) {
    
    Crypto.executeJobWithoutLock({

      method: 'getInvitationToken',
      params: [keylistId, userAlias]

    }, invitationTokenCb);
    
  };
  
  var _this = this;
  
  this.seedRandom = function () {

    _this.workerPool.scatterJob({
      method: 'seedRandom', fn: function () {

        var array = new Uint32Array(32);
        window.crypto.getRandomValues(array);
        array = _.map(array, function (i) { return i });
        return [array];

      } });

  };

  this.workerPool = new WorkerPool2(workerUrl, 4);

  // Add some initial entropy to the PRNG.
  this.seedRandom();

  // Add some entropy every minute.
  setInterval(this.seedRandom, 60000);

};

Crypto = new Crypto('workers/asocial.js');