Syme.Binders.add('feed', { comments: function(){

  // Open comment box
  $('#main').on('click', 'a.comment-action', function(){

    $(this).closest('.post').find('textarea')
      .removeClass('hidden').autogrow().focus();
    
  });

  // Create comment
  $('#main').on('keydown', '.comment-form textarea', function(e){

    var $textarea = $(this);
    
    if (e.which == 13 && !e.shiftKey) { // Enter key, but not Shift+Enter

      e.preventDefault();
      
      // Return if a comment is being posted.
      if ($textarea.data('active') == true) return;

      var $related_post     = $(this).closest('.post'),
          related_post_id   = $related_post.attr('id'),
          post_encrypted    = $related_post.data('encrypted'),
          $textarea         = $related_post.find('textarea');

      // If textarea is empty, do not submit form
      if(!$textarea.val().trim()) return;

      // Lock the comment textarea while posting.
      $textarea.data('active', true);

      // Allow hashtags despite markdown by escaping.
      var message = $textarea.val().replace('#', '\\#');

      var groupId = Syme.CurrentSession.getGroupId(),
          userId = Syme.CurrentSession.getUserId(),
          user   = Syme.CurrentSession.getUser(),
          postId = related_post_id;
      
      
      var url = SERVER_URL + '/users/' + userId + '/groups/' + 
                groupId    + '/posts/' + postId   + '/comments';
    
      // Get the users who were mentioned in the message.
      var mentions = Syme.Helpers.findUserMentions(message, groupId);

      // Post the comment.
      $.encryptedAjax(url, {
        
        type: 'POST',
        
        data: {
          mentioned_users: mentions
        },
        
        success: function (comment) {

          // Clear textarea and resize it
          $textarea.val('').change();

          // Show comment directly by sending the
          // unencrypted post by self-socket update
          comment.content = message;
          comment.encrypted = false;
          
          Syme.Socket.create.comment({
            target: postId, view: comment
          });

          // Reset textarea
          $textarea.trigger('reset');

          Syme.Crypto.encryptMessage(groupId, message, function (encryptedMessage) {

            $.encryptedAjax(url + '/' + comment.id, {
              
              type: 'PUT',
              
              data: { content: encryptedMessage },
              
              success: function () {
                
                // Unlock form.
                $textarea.data('active', false);
                
              },
              
              error: function () {
                
                $textarea.data('active', false);
                
                // Show error message.
                Alert.show(
                  Syme.Messages.error.postingFailed);
                
              }
              
              
            });
            
          });
          
        },
        
        error: function () {
          
          // Unlock comment textarea.
          $textarea.data('active', false);

          // Show error message.
          Alert.show(
            Syme.Messages.error.postingFailed);
          
        }
        
      });

    }
  });

  // Delete comment
  $('#main').on('click', '.comment-box a.comment-delete', function() {

      var post_id    = $(this).closest('.post').attr('id'),
          comment_id = $(this).closest('.comment-box').attr('id'),
          group      = Syme.CurrentSession.getGroupId(),
          route      = SERVER_URL + '/' + group + '/comment/delete';

      Confirm.show(
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

    Syme.Crypto.batchDecrypt(function(){

      // Show comments
      collection.removeClass('comment-hidden');

      // Add expanded state
      $this.parent().data('expanded', true);

      // Hide show more link
      $this.parent().addClass('hidden');

    });
  });

} }); // Syme.Binders.add();
