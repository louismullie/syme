Syme.Binders.add('global', { decrypt: function() {

  $(document).on('decrypt', '.post[data-encrypted="true"], .comment-box[data-encrypted="true"]', function (e, done) {

    var $this = $(this);

    var groupId           = $this.closest('.post').data('group_id'),
        encryptedContent  = $this.attr('data-content'),
        $contentContainer = $this.find('.collapsable').first();

    var decryptedCb = function(decryptedContent) {

      $this
        .attr('data-encrypted', false)
        .attr('data-content', decryptedContent);

      (done || $.noop)();

    };

    try {

      Syme.Crypto.decryptMessage(groupId, encryptedContent, decryptedCb);

    } catch(e) {

      debugger;
      var error = 'Decryption of post or comment failed';
      console.error(error); decryptedCb(error);

    }

  });

  // Avatar decryption
  $(document).on('decrypt', '.user-avatar', function(e, done) {

    var $this = $(this),
        done  = done || $.noop;

    var groupId   = Syme.CurrentSession.getGroupId(),
        userId    = $this.attr('data-user-id'),
        avatarId  = $this.attr('data-avatar-id'),
        keys      = $this.attr('data-keys');

    if ( !keys ) return done();

    // Decrypt and place avatar
    var file = Syme.FileManager.buildFileInfo(avatarId, groupId, keys);

    Syme.FileManager.getFile(file, function(url) {

      if (!url) return done();

      // Set new src to master and slaves
      $this.add('.slave-avatar[data-user-id="' + userId + '"]')
        .attr('src', url);

      // Set as decrypted
      $this.attr('data-encrypted', false);

      done();

    });

  });

  // Background image decryption
  $(document).on('decrypt', '.encrypted-background-image', function(e, done){

    var $this = $(this),
        done  = done || $.noop;

    var imageId = $this.attr('data-attachment-id'),
        keys    = $this.attr('data-attachment-keys'),
        groupId = $this.attr('data-attachment-group');

    if ( !keys ) return done();

    var callback = function(url) {

      if (!url) return done();

      $this.css("background-image", "url('" + url + "')");

      // Set as decrypted
      $this.attr('data-decrypted', true);

      done();

    }

    var file = Syme.FileManager.buildFileInfo(imageId, groupId, keys);

    // Decrypt and place background-image
    Syme.FileManager.getFile(file, callback);

  });

  // Media decryption
  $(document).on('decrypt', '.encrypted-image, .encrypted-video, .encrypted-audio', function(e, done){

    var $this = $(this),
        done  = done || $.noop;

    var mediaId = $this.attr('data-attachment-id'),
        keys    = $this.attr('data-attachment-keys'),
        type    = $this.attr('data-attachment-type'),
        groupId = $this.attr('data-attachment-group');

    if ( !keys ) {
      console.log('NO KEYS FOR MESSAGE');
      return done();
    }

    var callback = function(url){

      if (!url) return done();

      // Set src to element
      $this.attr('src', url)
        .removeClass('.encrypted-' + type);

      // Set as decrypted
      $this.attr('data-encrypted', false);

      done();

    };

    // Decrypt and place media
    var file = Syme.FileManager.buildFileInfo(mediaId, groupId, keys);
    Syme.FileManager.getFile(file, callback);

  });

  // Synchronize slaves to master avatars
  $(document).on('sync', '.slave-avatar', function(){

    var $this = $(this);

    var userId  = $this.attr('data-user-id'),
        master  = $('.user-avatar[data-user-id="' + userId + '"]');

    $this.attr('src', master.attr('src'));

  });


} });