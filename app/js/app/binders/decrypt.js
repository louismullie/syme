Syme.Binders.add('global', { decrypt: function() {

  // Post and comments decryption and formatting.
  $(document).on({

    // Formatting
    format: function (e) {

      var $this         = $(this),
          $collapsable  = $this.find('.collapsable[data-encrypted="false"]').first();

      // Create a jQuery wrapper around markdown'd text
      var $content = $( marked( $collapsable.text() ) );

      // Replace mentions
      $content.find('a[href^="id:"]').each(function(){

        // Get the part after the 'id:'
        var id = $(this).attr('href').split(':')[1];

        // Add class, remove link and add data
        $(this).addClass('mentioned-user')
               .attr('href', '#')
               .attr('data-mentioned-user-id', id);

      });

      // Make sure external links open in new windows.
      $content.find('a:not([href="#"])').attr('target', '_blank');

      // Put commenter name and comment tools in first paragraph of comment
      $collapsable.closest('.comment-box').find('a.commenter-name')
        .prependTo( $content.find('p:first-child') );

      // Replace old content by formatted content
      $collapsable.html( $content );

      // Collapse long content.
      Syme.Helpers.collapseHTML(5, 'Read more');

      // Oembed.
      $collapsable.oembed();

      // Format dynamic timestamps.
      $this.find('time.timeago').timeago();

    },

    // Decryption
    decrypt: function (e, done) {

      var $this = $(this),
          done  = done || $.noop;

      var $collapsable  = $this.find('.collapsable[data-encrypted="true"]').first(),
          text          = $collapsable.text().replace(/^\s+|\s+$/g, ''),
          groupId       = $this.closest('.post').data('group_id');

      // Fault tolerance to prevent JSON.parse from failing
      if (!text.length) return;

      /* LOUIS: TO ADD DIRECTLY IN Syme.Crypto.decryptMessage */

      // Check that keys exist for current user.
      var userId  = Syme.CurrentSession.getUserId(),
          message = JSON.parse($.base64.decode(text));

      // Throw exception if they don't.
      if (message.keys[userId] == undefined) {
        $collapsable.html('_This message could not be decrypted._');
        return done();
      }

      /* ---------------- */

      // Decrypt message
      Syme.Crypto.decryptMessage(groupId, text, function(decryptedText){

        // Retrieve the new key and reload if key is missing.
        if (decryptedText.error && decryptedText.error.missingKey) {

          var missingKey    = decryptedText.error.missingKey,
              baseUrl       = Syme.Url.fromGroup(missingKey.groupId),
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

        }

        // If everything is alright, replace encrypted text by decrypted
        // text in DOM, and mark container as decrypted.
        $collapsable.text(decryptedText).attr('data-encrypted', false);

        // Format the decrypted post or comment
        $this.trigger('format');

        // Decryption callback if there is one
        done();

      });

    }
  }, '.post, .comment-box');

  // Avatar decryption
  $(document).on('decrypt', '.user-avatar', function(e, done) {

    var $this = $(this),
        done  = done || $.noop;

    var group_id  = Syme.CurrentSession.getGroupId(),
        user_id   = $this.attr('data-user-id'),
        avatar_id = $this.attr('data-avatar-id'),
        keys      = $this.attr('data-keys');

    if ( !keys ) return done();

    var callback = function(url) {

      if (!url) return done();

      // Set new src to master and slaves
      $this.add('.slave-avatar[data-user-id="' + user_id + '"]')
        .attr('src', url);

      // Set as decrypted
      $this.attr('data-decrypted', true);

      done();
    };

    // Decrypt and place avatar
    FileManager.getFile(avatar_id, keys, callback, group_id);

  });

  // Synchronize slaves to master avatars
  $(document).on('sync', '.slave-avatar', function(){

    var $this = $(this),
        done  = done || $.noop;

    var user_id     = $this.attr('data-user-id'),
        master      = $('.user-avatar[data-user-id="' + user_id + '"]');

    $this.attr('src', master.attr('src'));

  });

  // Media decryption
  $(document).on('decrypt', '.encrypted-image, .encrypted-video, .encrypted-audio', function(e, done){

    var $this = $(this),
        done  = done || $.noop;

    var mediaId = $this.attr('data-attachment-id'),
        keys     = $this.attr('data-attachment-keys'),
        type     = $this.attr('data-attachment-type'),
        groupId = $this.attr('data-attachment-group');

    if ( !keys ) return done();

    var callback = function(url){

      if (!url) return done();

      // Set src to element
      $this.attr('src', url)
        .removeClass('.encrypted-' + type);

      // Set as decrypted
      $this.attr('data-decrypted', true);

      done();
    };

    // Decrypt and place media
    FileManager.getFile(mediaId, keys, callback, groupId);

  });


} });