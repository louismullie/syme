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
            }, true);

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

      var postId    = $(this).closest('.post').attr('id'),
          commentId = $(this).closest('.comment-box').attr('id');

      var deleteCommentUrl = Syme.Url.fromCurrentGroup(
        'posts', postId, 'comments', commentId);

      Confirm.show(
        'Do you really want to delete this comment?',
        {
          closable: true,
          title: 'Delete comment',
          submit: 'Delete',
          cancel: 'Cancel',

          onsubmit: function(){

            $.encryptedAjax(deleteCommentUrl, {

              type: 'DELETE',

              success: function () {
                Syme.Socket.delete.comment({ target: commentId });
              },

              error: function (response) {
                Syme.Error.ajaxError(response, 'delete', 'comment');
              }

            });

          }
        }
      );

  });

  // Organize, collapse and decrypt comments, updating counts
  $('#main').on('organize', '.comments', function(e){

    var $this         = $(this),
        $comments     = $this.find('.comment-box'),
        commentsCount = $comments.length,
        $container    = $this.closest('.post-comments');

    // Show or hide container (thus textarea)
    var containerAction = commentsCount > 0 ? 'removeClass' : 'addClass';
    $container[containerAction]('no-comments');

    // Sort by timestamp
    $comments.detach().sort(function(a, b) {

      // Get timestamps of compared elements
      a = new Date( $(a).attr('data-timestamp') );
      b = new Date( $(b).attr('data-timestamp') );

      // Order chronogically
      return a < b ? -1 : a > b ? 1 : 0;

    }).appendTo( $this );

    var collapseAfter = !!$this.data('expanded') ? Infinity : 3,
        $toDecrypt    = $();

    // Show (and potentially decrypt) or hide each comment
    $comments.each(function(i){

      var $comment    = $(this),
          shouldHide  = i < commentsCount - collapseAfter;

      // Collapse or hide the comment
      $comment[shouldHide ? 'addClass' : 'removeClass']('collapsed');

      // If it's encrypted, add to collection to $toDecrypt
      if ( !shouldHide && $comment.attr('data-encrypted') == "true" )
        $toDecrypt = $toDecrypt.add( $comment );

    });

    var showCommentsCallback = function () {

      var collapsedCommentsCount  = $comments.filter('.collapsed').length;
          showMoreAction          = collapsedCommentsCount > 0 ? 'removeClass' : 'addClass';

      // Show or hide show-more count and update it
      $this.find('.show-more')[showMoreAction]('hidden')
           .find('span').html(collapsedCommentsCount);

      // Timeago
      $this.find('time.timeago').timeago();

    };

    if ( $toDecrypt.length ) {
      Syme.Crypto.batchDecrypt(showCommentsCallback, $toDecrypt);
    } else {
      showCommentsCallback();
    }

    // Update global comment count in post
    $this.closest('.post').find('[partial="feed-comment-count"]')
      .renderHbsTemplate({ comment_count: commentsCount });

  });

  // Show more comments
  $('#main').on('click', '.show-more a', function(e){

    $(this).closest('.comments')
      .data('expanded', true)
      .trigger('organize');

  });

} }); // Syme.Binders.add();
