asocial.binders.add('global', { decrypt: function() {

  // Post and comment decryption
  $(document).on('decrypt', '.encrypted', function(e){

    var $this = $(this);

    var post    = $this.closest('.post'),
        text    = $this.text(),
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
      asocial.helpers.collapseHTML(5, 'See more');

      // Parse oEmbed links. Use fill mode to strip links.
      $('.post-content').oembed();

      // Timeago
      $('time.timeago').timeago();

      // Show post if post was hidden (not sure about that methodology)
      post.removeClass('hidden');

    };

    // Decrypt, then format element
    Crypto.decryptMessage(groupId, text, formatDecryptedText);

  });

  // Avatar decryption
  $(document).on('decrypt', '.user-avatar', function() {

    var $this = $(this);

    var group_id  = CurrentSession.getGroupId(),
        user_id   = $this.data('user-id'),
        avatar_id = $this.data('avatar-id'),
        keys      = $this.data('keys');

    var callback = function(url) {
      // Set new src to master and slaves
      $this.add('.slave-avatar[data-user-id="' + user_id + '"]')
        .attr('src', url);
    };

    // Decrypt and place avatar
    asocial.crypto.getFile(avatar_id, keys, callback, group_id);

  });

  // Synchronize slaves to master avatars
  $(document).on('sync', '.slave-avatar', function(){
    var user_id     = $(this).data('user-id'),
        master      = $('.user-avatar[data-user-id="' + user_id + '"]');

    $(this).attr('src', master.attr('src'));
  });

  // Media decryption
  $(document).on('decrypt', '.encrypted-image, .encrypted-video, .encrypted-audio', function(){

    var $this = $(this);

    var media_id = $this.data('attachment-id');
        keys     = $this.data('attachment-keys'),
        type     = $this.data('attachment-type'),
        group_id = $this.data('attachment-group');

    var callback = function(url){
      // Set src to element
      $this.attr('src', url)
        .removeClass('.encrypted-' + type);
    };

    console.log('Decrypting ' + type, 'media_id ' + media_id, 'group_id ' + group_id, 'keys', keys);

    // Decrypt and place media
    asocial.crypto.getFile(media_id, keys, callback, group_id);

  });

  // Background image decryption
  $(document).on('decrypt', '.encrypted-background-image', function(){

    var $this = $(this);

    var image_id  = $this.data('attachment-id'),
        keys      = $this.data('attachment-keys'),
        group_id  = $this.data('attachment-group');

    var callback = function(url) {
      $this.css("background-image", "url('" + url + "')");
    }

    // Decrypt and place background-image
    asocial.crypto.getFile(image_id, keys, callback, group_id);

  });

} });