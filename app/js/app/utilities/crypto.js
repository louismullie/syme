Syme.Crypto = function (workerUrl) {

  var _this = this;

  this.locked         = false;
  this.onLockRelease  = [];

  this.batchDecrypt = function(batchDecryptCallback, collection){

    // Defaults
    var batchDecryptCallback  = batchDecryptCallback || $.noop;
        collection            = collection ||
          $('[data-encrypted="true"]:not(#feed[data-single-post=""] .comment-box.collapsed)');


    // Asynchronous counter for decryption
    var decryptCounter = new Syme.Countable( collection,

      // Increment
      function(index, length) {
        // Prevent jumps in progress bar if multiple
        // batchDecrypt run at the same time
        if (NProgress.status < index / length)
          NProgress.set( index / length );
      },

      // Done
      function (elapsedTime) {
        _this.formatCollection(collection, batchDecryptCallback);
      }

    );

    // Trigger decrypt on every element
    collection.trigger('decrypt', decryptCounter.increment);

  };

  // Move to binders
  this.formatCollection = function (collection, batchDecryptCallback) {

    // Default callback
    batchDecryptCallback = batchDecryptCallback || $.noop;

    var $postsAndComments = collection.filter('.post, .comment-box');

    // Sync slave avatars
    $postsAndComments.find('.slave-avatar').trigger('sync');

    // Format textareas

    $postsAndComments.find('textarea').trigger('format');

    // Show posts and comments
    $postsAndComments.removeClass('hidden');

    $postsAndComments.find('.encrypted-image').trigger('decrypt');
    
    // Seem to sometimes fail accurate height
    // calculations in a seemingly non-deterministic way
    // Syme.Helpers.collapseHTML();

    // Callback for batchDecrypt
    batchDecryptCallback();

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

  this.decrypt = function (key, content, decryptedMessageCb) {

    Syme.Crypto.executeJobWithoutLock({
      method: 'decrypt'
    }, function (message) {
      decryptedMessageCb(message);
    });

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

  this.acceptInviteRequest = function (inviteRequest, inviteAcceptedCb) {

    Syme.Crypto.executeJobWithLock({

      method: 'acceptInviteRequest',
      params: [inviteRequest]

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

  this.decryptMessage = function (keylistId, text, decryptedMessageCb) {

    // Check that keys exist for current user.
    var userId  = Syme.CurrentSession.getUserId(),
        message = JSON.parse($.base64.decode(text));

    // Return error message to callback if they don't
    if (message.keys[userId] == undefined)
      decryptedMessageCb('There was a problem with the decryption');

    Syme.Crypto.executeJobWithoutLock({

      method: 'decryptMessage',
      params: [keylistId, text]

    }, function(decryptedText){

      // Retrieve the new key and reload if key is missing.
      if (decryptedText.error && decryptedText.error.missingKey)
        return _this.getMissingKey( decryptedText.error.missingKey );

      decryptedMessageCb(decryptedText);

    });

  };

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

  this.deriveKeys = function(password, salt, bits, generatedKeysCb) {

    Syme.Crypto.executeJobWithoutLock({

      method: 'deriveKeys',
      params: [password, salt, bits]

    }, generatedKeysCb);

  };

  this.getKeyFingerprint = function (keylistId, userAlias, userRole, inviteePublicKey, keyFingerprintCb) {

    Syme.Crypto.executeJobWithoutLock({

      method: 'getKeyFingerprint',
      params: [keylistId, userAlias, userRole, inviteePublicKey]

    }, keyFingerprintCb);

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