asocial.binders.add('global', { decrypt: function() {

  // Post and comment decryption
  $(document).on('decrypt', '.encrypted', function(e, done){

    var $this = $(this),
        done  = done || function(){};

    var post    = $this.closest('.post'),
        text    = $this.text().replace(/^\s+|\s+$/g, ''),
        groupId = CurrentSession.getGroupId();

    var formatDecryptedText = function(decryptedText) {

      // Insert the markdown'd decrypted text
      $this.html( marked(decryptedText) );

      // Transform the .encrypted into .collapsable
      $this.removeClass('encrypted').addClass('collapsable');

      // Put commenter name and comment tools in first paragraph of comment
      $this.closest('.comment-box').find('a.commenter-name')
        .prependTo( $this.closest('.collapsable').find('p:first-child') );

      // Collapse long text
      asocial.helpers.collapseHTML(5, 'Read more');

      // Parse oEmbed links. Use fill mode to strip links.
      $('.post-content').oembed();

      // Timeago
      $('time.timeago').timeago();

      done();

    };

    if (JSON.parse($.base64.decode(text)).keys[CurrentSession.getUserId()] == undefined)
      console.log($.base64.decode(text));

    // Decrypt, then format element
    Crypto.decryptMessage(groupId, text, formatDecryptedText);

  });

  // Avatar decryption
  $(document).on('decrypt', '.user-avatar', function(e, done) {

    var $this = $(this),
        done  = done || function(){};

    var group_id  = CurrentSession.getGroupId(),
        user_id   = $this.attr('data-user-id'),
        avatar_id = $this.attr('data-avatar-id'),
        keys      = $this.attr('data-keys');

    if ( !keys ) return done();

    var callback = function(url) {
      // Set new src to master and slaves
      $this.add('.slave-avatar[data-user-id="' + user_id + '"]')
        .attr('src', url);

      done();
    };

    // Decrypt and place avatar
    asocial.crypto.getFile(avatar_id, keys, callback, group_id);

  });

  // Synchronize slaves to master avatars
  $(document).on('sync', '.slave-avatar', function(){

    var $this = $(this),
        done  = done || function(){};

    var user_id     = $this.attr('data-user-id'),
        master      = $('.user-avatar[data-user-id="' + user_id + '"]');

    $this.attr('src', master.attr('src'));

  });

  // Media decryption
  $(document).on('decrypt', '.encrypted-image, .encrypted-video, .encrypted-audio', function(e, done){

    var $this = $(this),
        done  = done || function(){};

    var media_id = $this.attr('data-attachment-id');
        keys     = $this.attr('data-attachment-keys'),
        type     = $this.attr('data-attachment-type'),
        group_id = $this.attr('data-attachment-group');

    if ( !keys ) return done();

    var callback = function(url){
      // Set src to element
      $this.attr('src', url)
        .removeClass('.encrypted-' + type);

      done();
    };

    // Decrypt and place media
    asocial.crypto.getFile(media_id, keys, callback, group_id);

  });

  // Background image decryption
  $(document).on('decrypt', '.encrypted-background-image', function(e, done){

    var $this = $(this),
        done  = done || function(){};

    var image_id  = $this.attr('data-attachment-id'),
        keys      = $this.attr('data-attachment-keys'),
        group_id  = $this.attr('data-attachment-group');

    if ( !keys ) return done();

    var callback = function(url) {
      $this.css("background-image", "url('" + url + "')");

      done();
    }

    // Decrypt and place background-image
    asocial.crypto.getFile(image_id, keys, callback, group_id);

  });

} });