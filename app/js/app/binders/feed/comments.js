Syme.Binders.add('feed', { comments: function(){

  // Open comment box
  $('#main').on('click', 'a.comment-action, a#comment-count', function(){

    // Show comment box if it is hidden
    $(this).closest('.post').find('.post-comments')
      .removeClass('no-comments')
      // Focus on comment textarea
      .find('textarea')
        .focus();

  });

  // Create comment
  $('#main').on('keydown', '.comment-form textarea', function(e){

    var $textarea = $(this);

    if (e.which == 13 && !e.shiftKey) { // Enter key, but not Shift+Enter

      e.preventDefault();

      var $related_post     = $(this).closest('.post'),
          related_post_id   = $related_post.attr('id'),
          post_encrypted    = $related_post.data('encrypted'),
          $textarea         = $related_post.find('textarea');

      var user              = Syme.CurrentSession.getUser(),
          groupId           = Syme.CurrentSession.getGroupId(),
          postId            = related_post_id;

      // If textarea is empty, do not submit form
      if(!$textarea.val().trim()) return;

      // Lock the comment textarea while posting.
      if ($textarea.data('active') == true) return;
      $textarea.data('active', true);

      // Begin posting once we get the async mentions.
      var commentWithMentions = function(mentions_data){

        var createCommentUrl = Syme.Url.fromCurrentGroup('posts', postId, 'comments');

        $.encryptedAjax(createCommentUrl, {

          type: 'POST',

          data: {
            mentioned_users: mentions_data.mentioned_users
          },

          success: function (comment) {

            // Get the message with mentions markup and
            // allow hashtags despite markdown by escaping #
            var message = mentions_data.text.replace('#', '\\#');

            // Show comment directly by sending the
            // unencrypted post by self-socket update
            comment.content = message;
            comment.encrypted = false;

            Syme.Socket.create.comment({
              target: postId, view: comment
            });

            // Reset textarea
            $textarea.trigger('reset');
            
            NProgress.showSpinner();
            
            Syme.Crypto.encryptMessage(groupId, message, function (encryptedMessage) {

              var updateCommentUrl = Syme.Url.join(createCommentUrl, comment.id);
              
              $.encryptedAjax(updateCommentUrl, {

                type: 'PUT',

                data: { content: encryptedMessage },

                success: function () {
                  
                  NProgress.hideSpinner();
                  
                  $textarea.data('active', false);
                  
                },

                error: function () {
                  
                  // PUT failed
                  Alert.show(Syme.Messages.error.postingFailed);
                  NProgress.hideSpinner();
                  $textarea.data('active', false);
                }

              });

            });

          },

          error: function () {
            // POST failed
            Alert.show(Syme.Messages.error.postingFailed);
            $textarea.data('active', false);
          }

        });

      };

      // Get the async mentions
      $textarea.trigger('getMentionsMarkup', commentWithMentions);

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

    var $collection       = $(this).closest('.comments')
        $hidden_comments  = $collection.find('.comment-box.hidden');

    Syme.Crypto.batchDecrypt(function(){

      // Show comment box and textarea if they are hidden
      $collection.removeClass('no-comments');

      // Show decrypted comments
      $hidden_comments.removeClass('hidden');

      $collection.find('.show-more')
        // Add expanded state
        .data('expanded', true)
        // Hide show more link
        .addClass('hidden');

    }, $hidden_comments.find('.encrypted'));
  });

} }); // Syme.Binders.add();
