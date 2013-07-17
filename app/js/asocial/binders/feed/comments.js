asocial.binders.add('feed', { comments: function(){

  // Open comment box
  $('#main').on('click', 'a.comment-action', function(){

    $(this).closest('.post').find('textarea')
      .removeClass('hidden').autogrow().focus();
    
  });

  // Create comment
  $('#main').on('keydown', '.comment-form textarea', function(e){
    if (e.which == 13 && !e.shiftKey) { // Enter key, but not Shift+Enter

      e.preventDefault();

      // Storing elements for performance and persistance.
      var related_post    = $(this).closest('.post'),
          related_post_id = related_post.attr('id'),
          post_encrypted  = related_post.data('encrypted'),
          textarea        = related_post.find('textarea');

      // If textarea is empty, do not submit form
      if(!textarea.val().trim()) return;

      // Allow hashtags despite markdown by escaping.
      var message = textarea.val().replace('#', '\\#');

      var groupId = CurrentSession.getGroupId();

      Crypto.encryptMessage(groupId, message, function (encryptedMessage) {

        // Get the users who were mentioned in the message.
        var mentions = asocial.helpers.findUserMentions(message, groupId);

        // Post the comment
        $.post(SERVER_URL + '/' + groupId + '/comment/create', $.param({
          post_id: related_post_id,
          content: encryptedMessage,
          mentioned_users: mentions
        }));

        // Clear textarea and resize it
        textarea.val('').change();

      });

    }
  });

  // Delete comment
  $('#main').on('click', '.comment-box a.comment-delete', function() {

      var post_id    = $(this).closest('.post').attr('id'),
          comment_id = $(this).closest('.comment-box').attr('id'),
          group      = CurrentSession.getGroupId(),
          route      = SERVER_URL + '/' + group + '/comment/delete';

      asocial.helpers.showConfirm(
        'Do you really want to delete this comment?',
        {
          closable: true,
          title: 'Delete comment',
          submit: 'Delete',
          cancel: 'Cancel',

          onsubmit: function(){
            $.post(route, { post_id: post_id, comment_id: comment_id });
          }
        }
      );

  });

  // Show more comments
  $('#main').on('click', '.show-more a', function(e){

    var $this       = $(this),
        collection  = $this.closest('.comments').find('.comment-hidden');

    // Show hidden comments
    collection.find('.encrypted.comment-hidden').removeClass('comment-hidden');

    asocial.crypto.batchDecrypt(function(){

      // Show comments
      collection.removeClass('comment-hidden');

      // Add expanded state
      $this.parent().data('expanded', true);

      // Hide show more link
      $this.parent().addClass('hidden');

    });
  });

} }); // asocial.binders.add();