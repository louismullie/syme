asocial.binders.add('feed', { comments: function(){

  // Open comment box
  $('#main').on('click', 'a.post-comments', function(){
    $(this).closest('.post-content').find('textarea').focus();
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

      var message = textarea.val();
      var comment = JSON.stringify(asocial.crypto.encryptMessage(message));

      // Get the users who were mentioned in the message.
      var mentions = JSON.stringify(asocial.helpers.findUserMentions(message));

      // Post the comment
      $.post('/' + asocial.state.group.id + '/comment/create', $.param({
        post_id: related_post_id,
        content: comment,
        mentioned_users: mentions
      }));

      // Clear textarea and resize it
      textarea.val('').css('height', textarea.css('line-height'));

    }
  });

  // Delete comment
  $('#main').on('click', '.comment-box a.comment-delete', function() {

      var post_id    = $(this).closest('.post').attr('id'),
          comment_id = $(this).closest('.comment-box').attr('id'),
          group      = asocial.state.group.id,
          route      = '/' + group + '/comment/delete';

      if(confirm(locales.en.feed.delete_comment_confirm)) {
        $.post(route, $.param({ post_id: post_id, comment_id: comment_id }));
      }

  });

  // Show more comments
  $('#main').on('click', '.show-more a', function(e){
    // Show hidden comments
    $(this).closest('.comments').find('.comment-hidden').removeClass('comment-hidden');

    // Add expanded state
    $(this).parent().data('expanded', true);

    // Hide show more link
    $(this).parent().addClass('hidden');
  });

} }); // asocial.binders.add();