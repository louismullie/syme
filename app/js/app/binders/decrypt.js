Syme.Binders.add('global', { decrypt: function() {

  // Avatar decryption
  $(document).on('decrypt', '.user-avatar', function(e) {

    e.stopPropagation();

    var $this = $(this);

    var groupId   = Syme.CurrentSession.getGroupId(),
        userId    = $this.attr('data-user-id'),
        avatarId  = $this.attr('data-avatar-id'),
        keys      = $this.attr('data-keys');

    if ( !keys ) return;

    // Decrypt and place avatar
    var file = Syme.FileManager.buildFileInfo(avatarId, groupId, keys);

    Syme.FileManager.getFile(file, function(url) {

      if (!url) return;

      // Set new src to master and slaves
      $this.add('.slave-avatar[data-user-id="' + userId + '"]')
        .attr('src', url);

      // Set as decrypted
      $this.attr('data-encrypted', false);

    });

  });

  // Background image decryption
  $('.encrypted-background-image').map(function(ind, el){

    var $this = $(el);
    console.log($this);
    var imageId = $this.attr('data-attachment-id'),
        keys    = $this.attr('data-attachment-keys'),
        groupId = $this.attr('data-attachment-group');

    if ( !keys ) return;

    var callback = function(url) {

      if (!url) return;

      Syme.FileManager.setAsBackgroundImage($this, url);

      // Set as decrypted
      $this.attr('data-decrypted', true);

    }

    var file = Syme.FileManager.buildFileInfo(imageId, groupId, keys);

    // Decrypt and place background-image
    Syme.FileManager.getFile(file, callback);

  });

  // Media decryption
  $(document).on('decrypt', '.encrypted-image, .encrypted-video, .encrypted-audio', function(e){

    e.stopPropagation();

    var $this = $(this);

    var mediaId = $this.attr('data-attachment-id'),
        keys    = $this.attr('data-attachment-keys'),
        type    = $this.attr('data-attachment-type'),
        groupId = $this.attr('data-attachment-group');

    if ( !keys ) {
      console.log('NO KEYS FOR ENCRYPTED MEDIA');
      return;
    }

    var callback = function(url){

      if (!url) return;

      // Set src to element
      Syme.FileManager.setAsImageSrc($this, url);
      $this.removeClass('.encrypted-' + type);

      // Set as decrypted
      $this.attr('data-encrypted', false);

    };

    // Decrypt and place media
    var file = Syme.FileManager.buildFileInfo(mediaId, groupId, keys);
    Syme.FileManager.getFile(file, callback);

  });

  // Synchronize slaves to master avatars
  $(document).on('sync', '.slave-avatar', function(e){

    e.stopPropagation();

    var $this = $(this);

    var userId  = $this.attr('data-user-id'),
        master  = $('.user-avatar[data-user-id="' + userId + '"]');

    $this.attr('src', master.attr('src'));

  });


} });