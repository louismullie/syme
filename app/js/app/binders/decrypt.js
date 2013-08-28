Binders.add('global', { decrypt: function() {

  // Post and comment decryption
  $(document).on('decrypt', '.encrypted', function(e, done){

    var $this = $(this),
        done  = done || function(){};

    var $post     = $this.closest('.post'),
        text      = $this.text().replace(/^\s+|\s+$/g, ''),
        groupId   = $post.data('group_id');

    var formatDecryptedText = function(decryptedText) {

      // Retrieve the new key.
      if (decryptedText.error && decryptedText.error.missingKey) {

        var missingKey = decryptedText.error.missingKey

        var url = SERVER_URL + '/users/' + CurrentSession.getUserId() + '/groups/' +
            missingKey.groupId + '/invitations/' + missingKey.userId;

        $.getJSON(url,

          function (addUserRequest) {

            var user = CurrentSession.getUser();
            user.addUsersRequest([addUserRequest],
              function () { Router.reload(); });

          }

        );

        return done();

      }

      // Format the text with Markdown, and make sure links open in new windows.
      var formattedText = marked(decryptedText).replace('<a', '<a target="_blank"');

      // Create a jQuery wrapper around markdown'd decrypted text
      var $content = $( Helpers.replaceUserMentions(formattedText, groupId) );

      // Put commenter name and comment tools in first paragraph of comment
      $content.filter('p:first-child').prepend(
        $this.closest('.comment-box').find('a.commenter-name')
      );

      $this
        // Output decrypted content
        .html( $content )
        // Transform the .encrypted into .collapsable
        .removeClass('encrypted').addClass('collapsable');

      // Collapse long posts.
      Helpers.collapseHTML(5, 'Read more');

      // Embed rich media content.
      $this.find('.post-content').oembed();

      // Format dynamic timestamps.
      $post.find('time.timeago').timeago();

      // Format comment textarea.
      $post.find('textarea').trigger('format');

      done();

    };

    // Decrypt, then format element
    if ($this.data('encrypted') == true) {

      // Check that keys exist for current user.
      var userId = CurrentSession.getUserId();
      var message = JSON.parse($.base64.decode(text));

      // Throw exception if they don't.
      if (message.keys[userId] == undefined) {
        console.log('ERROR: Missing keys for current user.');
        formatDecryptedText('_This message could not be decrypted._');
      }

      Crypto.decryptMessage(groupId, text, formatDecryptedText);

    } else {

      // If element not encrypted, just format it.
      formatDecryptedText(text);

    }

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
        done  = done || function(){};

    var user_id     = $this.attr('data-user-id'),
        master      = $('.user-avatar[data-user-id="' + user_id + '"]');

    $this.attr('src', master.attr('src'));

  });

  // Media decryption
  $(document).on('decrypt', '.encrypted-image, .encrypted-video, .encrypted-audio', function(e, done){

    var $this = $(this),
        done  = done || function(){};

    var media_id = $this.attr('data-attachment-id'),
        keys     = $this.attr('data-attachment-keys'),
        type     = $this.attr('data-attachment-type'),
        group_id = $this.attr('data-attachment-group');

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
    FileManager.getFile(media_id, keys, callback, group_id);

  });


} });