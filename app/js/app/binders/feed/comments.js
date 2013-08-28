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

      var $related_post     = $(this).closest('.post'),
          related_post_id   = $related_post.attr('id'),
          post_encrypted    = $related_post.data('encrypted'),
          $textarea         = $related_post.find('textarea');

      var groupId = Syme.CurrentSession.getGroupId(),
          userId  = Syme.CurrentSession.getUserId(),
          user    = Syme.CurrentSession.getUser(),
          postId  = related_post_id;

      // If textarea is empty, do not submit form
      if(!$textarea.val().trim()) return;

      // Lock the comment textarea while posting.
      if ($textarea.data('active') == true) return;
      $textarea.data('active', true);

      // Begin posting once we get the async mentions.
      var commentWithMentions = function(mentions_data){

        var url = SERVER_URL + '/users/' + userId + '/groups/' +
                  groupId    + '/posts/' + postId   + '/comments';

        $.encryptedAjax(url, {

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

            Syme.Crypto.encryptMessage(groupId, message, function (encryptedMessage) {

              $.encryptedAjax(url + '/' + comment.id, {

                type: 'PUT',

                data: { content: encryptedMessage },

                success: function () {
                  $textarea.data('active', false);
                },

                error: function () {
                  // PUT failed
                  Alert.show(Syme.Messages.error.postingFailed);
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
