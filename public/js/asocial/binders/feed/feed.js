asocial.binders.add('feed', { feed: function(){

  // Unread button
  $('#main').on('click', '#newcontent a', function(e){

    if(asocial.socket.updatedComments > 0){
      // If there are new comments, reset feed
      // to reorder the bump sorting
      asocial.binders.loadRoute('feed');
    } else {
      // If there are only new post, append them
      asocial.helpers.showUnreadPosts();
    }

  });

  // Delete post/comment toggling
  $('#main').on({
    mouseenter: function(){
      $(this).find('a.post-delete, a.comment-delete').first()
        .css({ display: 'block' })
        .transition({ opacity: 1}, 100);
    },
    mouseleave: function(){
      $(this).find('a.post-delete, a.comment-delete').first()
        .transition({ opacity: 0}, 100)
        .css({ display: 'none' });
    }
  }, 'div.post-header, div.comment-box');

  // Delete post
  $('#main').on('click', '.post-header a.post-delete', function() {

      var post_id    = $(this).closest('.post').attr('id'),
          group      = asocial.state.group.id,
          route      = '/' + group + '/post/delete';

      asocial.helpers.showConfirm(
        'Do you really want to delete this post?',
        {
          closable: true,
          title: 'Delete post',
          submit: 'Delete',
          cancel: 'Cancel',

          onsubmit: function(){
            $.post(route, { post_id: post_id });
          }
        }
      );

  });

  // Load more button
  $('#main').on('click', '#load-more a', function(e){
    e.preventDefault();

    // Hide load-more container
    $(this).parent().fadeOut('fast');

    // Unlock infinite scrolling and load page
    $(window)
      .data('infinite-scroll-manual', false)
      .trigger('scroll');

  });

} }); // asocial.binders.add();