asocial.binders.add('feed', { decrypt: function(){

  // Post and comment decryption
  $('#main').on('decrypt', '.encrypted', function(e){

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
  $('#main').on('decrypt', '.user-avatar', function() {

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

  // Initial decryption
  var selectors = [
    // Feed elements
    '.encrypted', '.encrypted-image', '.encrypted-audio',
    '.encrypted-video', '.encrypted-background-image',

    // User avatars
    '.user-avatar'
  ];

  $(selectors.join(',')).trigger('decrypt');

} });