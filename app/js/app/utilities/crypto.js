Syme.Crypto = function (workerUrl) {

  var _this = this;
  
  this.locked = false;

  this.onLockRelease = [];
  
  this.batchDecrypt = function(callback, collection){

    // Default callback
    var callback = callback || function(){};

    // Cleanup / fix
    if (ONE_PAGE_VIEW) {
      $.each($('.comment-hidden'), function (ind, comment) {
        $(comment).removeClass('comment-hidden');
      });
    }
    
    // Default collection
    var collection = collection || $([

      // Feed elements
      '.encrypted:not(.comment-hidden)',
      '.encrypted-image:not([data-decrypted="true"])',
      '.encrypted-audio:not([data-decrypted="true"])',
      '.encrypted-video:not([data-decrypted="true"])',

      // User avatars
      '.user-avatar:not([data-decrypted="true"])'

    ].join(','));

    if (collection.length == 0)
      return;

    // Show spinner
    NProgress.start();

    // Initial decryption
    collection.batchDecrypt(function(elapsedTime){

      // Sync slave avatars
      $('.slave-avatar').trigger('sync');

      // Remove hidden class on posts
      $('.post').removeClass('hidden');

      // Textarea autosizing
      $('textarea.autogrow').autogrow();

      // Hide spinner
      NProgress.done();

      /*console.log(
        'Done decrypting collection of ' + this.length +
        ' items in ' + elapsedTime/1000 + 's', $(this)
      );*/

      callback.call(this);

    });

  };

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

    Syme.Crypto.executeJobWithoutLock({
      method: 'getEncryptedKeyfile'
    }, function (message) {
      encryptedKeyfileCb(message);
    });

  };

  // Development only!
  this.getSerializedKeyfile = function (keyfileCb) {

    Syme.Crypto.executeJobWithoutLock({

      method: 'getSerializedKeyfile'

    // Return encrypted keyfile.
    }, keyfileCb);

  };

  this.createKeylist = function (keylistId, encryptedKeyfileCb) {

    var _this = this;

    // Generate keylist for group.
    Syme.Crypto.executeJobWithLock({

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
    Syme.Crypto.executeJobWithLock({

      method: 'deleteKeylist',
      params: [keylistId]

    // Get encrypted keyfile.
    }, function () {
      _this.getEncryptedKeyfile(encryptedKeyfileCb);
    });

  };

  this.createInviteRequests = function (keylistId, userAliases, inviteCreatedCb) {

    Syme.Crypto.executeJobWithLock({

      method: 'createInviteRequests',
      params: [keylistId, userAliases]

    }, inviteCreatedCb);

  };

  this.acceptInviteRequest = function (inviteRequest, token, inviteAcceptedCb) {

    Syme.Crypto.executeJobWithLock({

      method: 'acceptInviteRequest',
      params: [inviteRequest, token]

    }, inviteAcceptedCb);

  };

  this.confirmInviteRequest = function (keylistId, inviteeId, inviteRequest, keysJson, inviteAcceptedCb) {

    Syme.Crypto.executeJobWithLock({

      method: 'confirmInviteRequest',
      params: [keylistId, inviteeId, inviteRequest, keysJson]

    }, inviteAcceptedCb);

  };

  this.completeInviteRequest = function (completeRequest, inviteCompletedCb) {

    Syme.Crypto.executeJobWithLock({

      method: 'completeInviteRequest',
      params: [completeRequest]

    }, inviteCompletedCb);

  };

  this.transferKeysRequest = function(keylistId, userId, keys, transferKeysCb) {

    Syme.Crypto.executeJobWithLock({

      method: 'transferKeysRequest',
      params: [keylistId, userId, keys]

    }, transferKeysCb);

  };

  this.addUsersRequest = function(addUsersRequest, addedUsersCb) {

    Syme.Crypto.executeJobWithLock({

      method: 'addUsersRequest',
      params: [addUsersRequest]

    }, addedUsersCb);

  };

  this.initializeKeyfile = function (userId, password, encKeyfile, encryptedKeyfileCb) {

    var _this = this;

    Syme.Crypto.workerPool.broadcastJob({

      method: 'initializeKeyfile',
      params: [userId, password, encKeyfile]

    }, function () {
      _this.getEncryptedKeyfile(encryptedKeyfileCb);
    });

  };

  this.encryptMessage = function(keylistId, message, encryptedMessageCb) {

    Syme.Crypto.executeJobWithoutLock({

      method: 'encryptMessage',
      params: [keylistId, message]

    }, encryptedMessageCb);

  };

  this.decryptMessage = function (keylistId, message, decryptedMessageCb) {

    Syme.Crypto.executeJobWithoutLock({

      method: 'decryptMessage',
      params: [keylistId, message]

    }, decryptedMessageCb);

  };

  this.uploadChunk = function (chunkInfo, uploadedChunkCb) {

    Syme.Crypto.executeJobWithoutLock(chunkInfo, uploadedChunkCb);

  };

  this.downloadChunk = function (chunkInfo, downloadedChunkCb) {

    Syme.Crypto.executeJobWithoutLock(chunkInfo, downloadedChunkCb);

  };

  this.generateRandomKeys = function(generatedKeysCb) {

    Syme.Crypto.executeJobWithoutLock({

      method: 'generateRandomHex',
      params: [256]

    }, generatedKeysCb);

  };
  
  this.deriveKeys = function(password, salt, generatedKeysCb) {

    Syme.Crypto.executeJobWithoutLock({

      method: 'deriveKeys',
      params: [password, salt]

    }, generatedKeysCb);

  };
  
  this.getInvitationToken = function (keylistId, userAlias, invitationTokenCb) {
    
    Syme.Crypto.executeJobWithoutLock({

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

Syme.Crypto = new Syme.Crypto('workers/app.js');