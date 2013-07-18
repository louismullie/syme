asocial.binders.add('global', { decrypt: function() {

  // Post and comment decryption
  $(document).on('decrypt', '.encrypted', function(e, done){

    var $this = $(this),
        done  = done || function(){};

    var post    = $this.closest('.post'),
        text    = $this.text().replace(/^\s+|\s+$/g, ''),
        groupId = post.data('group_id');

    var formatDecryptedText = function(decryptedText) {

      // Create a jQuery wrapper around markdown'd decrypted text
      var content = $( asocial.helpers.replaceUserMentions(marked(decryptedText), groupId) );

      // Put commenter name and comment tools in first paragraph of comment
      content.filter('p:first-child').prepend(
        $this.closest('.comment-box').find('a.commenter-name')
      );

      $this
        // Output decrypted content
        .html( content )
        // Transform the .encrypted into .collapsable
        .removeClass('encrypted').addClass('collapsable');

      // Collapse long text
      asocial.helpers.collapseHTML(5, 'Read more');

      // Parse oEmbed links. Use fill mode to strip links.
      $('.post-content').oembed();

      // Timeago
      $('time.timeago').timeago();
      
      $('textarea').autogrow();
      
      done();

    };

    if (JSON.parse($.base64.decode(text)).keys[CurrentSession.getUserId()] == undefined)
      throw 'Missing keys for current user.';

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

      // Set as decrypted
      $this.attr('data-decrypted', true);

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

      // Set as decrypted
      $this.attr('data-decrypted', true);

      done();
    };

    // Decrypt and place media
    asocial.crypto.getFile(media_id, keys, callback, group_id);

  });


} });