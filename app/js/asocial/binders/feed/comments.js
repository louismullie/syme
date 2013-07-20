asocial.binders.add('feed', { comments: function(){

  // Open comment box
  $('#main').on('click', 'a.comment-action', function(){

    $(this).closest('.post').find('textarea')
      .removeClass('hidden').autogrow().focus();
    
  });

  // Create comment
  $('#main').on('keydown', '.comment-form textarea', function(e){
    
    var $this = $(this);
    
    if (e.which == 13 && !e.shiftKey) { // Enter key, but not Shift+Enter

      e.preventDefault();
      
      // Return if a comment is being posted.
      if ($this.data('active') == true) return;
      
      // Lock the comment textarea while posting.
      $this.data('active', true);
      
      var related_post    = $(this).closest('.post'),
          related_post_id = related_post.attr('id'),
          post_encrypted  = related_post.data('encrypted'),
          textarea        = related_post.find('textarea');

      // If textarea is empty, do not submit form
      if(!textarea.val().trim()) return;

      // Allow hashtags despite markdown by escaping.
      var message = textarea.val().replace('#', '\\#');

      var groupId = CurrentSession.getGroupId()
          userId = CurrentSession.getUserId(),
          user   = CurrentSession.getUser(),
          postId = related_post_id;
      
      var timestamp = new Date;
      var createdAt = timestamp.toISOString();
    
      var shimComment = {
        
        target: postId,
        
        view: {
          
          // Generate a random, temporary comment ID.
          id: Math.random()*Math.exp(40).toString(),
          
          commenter: {
            
            id: userId,
            name: user.get('full_name'),
            avatar: {
              placeholder: true // *
            },
            
          },
          
          content: message,
          encrypted: false,
          created_at: createdAt,
          deletable: true,
          group_id: groupId,
          
          likeable: {
            
            has_likes: false,
            like_count: 0,
            liked_by_user: false,
            liker_names: ""
            
          }
        }
        
      };
      
      var $comment = asocial.socket.create.comment(shimComment, true);
      
      Crypto.encryptMessage(groupId, message, function (encryptedMessage) {

        // Get the users who were mentioned in the message.
        var mentions = asocial.helpers.findUserMentions(message, groupId);
        
        var url = SERVER_URL + '/users/' + userId + '/groups/' + 
                  groupId    + '/posts/' + postId   + '/comments';
        
        // Post the comment.
        $.ajax(url, {
          
          type: 'POST',
          
          data: {
            content: encryptedMessage,
            mentioned_users: mentions
          },
          
          success: function (comment) {

            $comment.attr('id', comment.id);
            $this.data('active', false);
            
          },
          
          error: function () {
            
            asocial.helpers.showAlert('Posting failed!');
            
          }
          
        });

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