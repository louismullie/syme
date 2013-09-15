Syme.Binders.add('global', { decrypt: function() {

  // Post & comments decryption
  $(document).on('decrypt', '.post, .comment-box', function (e, doneDecryptingCb) {

    // Prevent event propagation to children
    if ( e.target !== this ) return;

    var $this             = $(this),
        doneDecryptingCb  = doneDecryptingCb || $.noop;

    var $collapsable  = $this.find('.collapsable').first(),
        text          = $collapsable.text().replace(/^\s+|\s+$/g, ''),
        groupId       = $this.closest('.post').data('group_id');

    var replaceTextWithDecryptedText = function (decryptedText) {

      // Replace encrypted text by decrypted text in DOM
      $collapsable.text(decryptedText);

      // Mark the container as decrypted, and format
      $this.attr('data-encrypted', false).trigger('format');

      // Decryption callback if there is one
      doneDecryptingCb();

    };

    try {

      // Decrypt message
      Syme.Crypto.decryptMessage(groupId, text, replaceTextWithDecryptedText);

    } catch (e) {

      // In case of decryption failure, raise a console
      // error with full backtrace. It is not supposed to
      // happen, but keeping it as a debugging fail-safe
      // seems like common sense because it is arguably the
      // most crucial encryption-related event to happen to the DOM.
      console.error('Error in decryption', $this, e);

    }

  });

  // Post & comments formatting
  $(document).on('format', '.post, .comment-box', function (e) {

    // Prevent event propagation to children
    if ( e.target !== this ) return;

    var $this         = $(this),
        $collapsable  = $this.find('.collapsable').first();

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
      .prependTo( $content.filter('p').first() );

    // Replace old content by formatted content
    $collapsable.html( $content );

    // Oembed.
    $collapsable.oembed();

    // Format dynamic timestamps.
    $this.find('time.timeago').timeago();

  });

  // Avatar decryption
  $(document).on('decrypt', '.user-avatar', function(e, doneDecryptingCb) {

    // Prevent event propagation to children
    if ( e.target !== this ) return;

    var $this             = $(this),
        doneDecryptingCb  = doneDecryptingCb || $.noop;

    var group_id  = Syme.CurrentSession.getGroupId(),
        user_id   = $this.attr('data-user-id'),
        avatar_id = $this.attr('data-avatar-id'),
        keys      = $this.attr('data-keys');

    if ( !keys ) return doneDecryptingCb();

    var callback = function(url) {

      if (!url) return doneDecryptingCb();

      // Set new src to master and slaves
      $this.add('.slave-avatar[data-user-id="' + user_id + '"]')
        .attr('src', url);

      // Set as decrypted
      $this.attr('data-encrypted', false);

      doneDecryptingCb();

    };

    // Decrypt and place avatar
    FileManager.getFile(avatar_id, keys, callback, group_id);

  });

  // Synchronize slaves to master avatars
  $(document).on('sync', '.slave-avatar', function(){

    var $this = $(this);

    var user_id     = $this.attr('data-user-id'),
        master      = $('.user-avatar[data-user-id="' + user_id + '"]');

    $this.attr('src', master.attr('src'));

  });

  // Media decryption
  $(document).on('decrypt', '.encrypted-image, .encrypted-video, .encrypted-audio', function(e, doneDecryptingCb){

    var $this             = $(this),
        doneDecryptingCb  = doneDecryptingCb || $.noop;

    var mediaId   = $this.attr('data-attachment-id'),
        keys      = $this.attr('data-attachment-keys'),
        type      = $this.attr('data-attachment-type'),
        groupId   = $this.attr('data-attachment-group');

    if ( !keys ) return doneDecryptingCb();

    var callback = function(url){

      if (!url) return doneDecryptingCb();

      // Set src to element
      $this.attr('src', url)
        .removeClass('.encrypted-' + type);

      // Set as decrypted
      $this.attr('data-encrypted', false);

      doneDecryptingCb();
    };

    // Decrypt and place media
    FileManager.getFile(mediaId, keys, callback, groupId);

  });


} });