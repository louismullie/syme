asocial.binders.add('feed', { feed: function(){

  // Check if need to integrate user within a group (1st
  // visit on group) or if need to update a user's keylist
  // (meaning one or more new users have joined the group).
  asocial.state.getState('invite', function (authorized) {

    // The user should always be authorized for the invite.
    if (!authorized) { asocial.helpers.showAlert('Not authorized for invite!'); }

    if (asocial.state.invite.integrate)
      asocial.invite.integrate();

    if (asocial.state.invite.update)
      asocial.invite.update();

  }, { group_id: asocial.binders.getCurrentGroup() });

  // Unread button
  $('#main').on('click', '#newcontent a.btn', function(e){

    if(asocial.socket.updatedComments > 0){
      // If there are new comments, reset feed
      // to reorder the bump sorting
      asocial.binders.loadRoute('feed');
    } else {
      // If there are only new post, append them
      asocial.helpers.showUnreadPosts();
    }

  });

  // Delete post toggling
  $("div.post-header").on({
    mouseenter: function(){
      $(this).find('a.post-delete')
        .css({ display: 'block' })
        .transition({ opacity: 1}, 100);
    },
    mouseleave: function(){
      $(this).find('a.post-delete')
        .transition({ opacity: 0}, 100)
        .css({ display: 'none' });
    }
  });

  // Delete post
  $('#main').on('click', '.post-header a.post-delete', function() {

      var post_id    = $(this).closest('.post').attr('id'),
          group      = asocial.binders.getCurrentGroup(),
          route      = '/' + group + '/post/delete';

      if(confirm(locales.en.feed.delete_post_confirm)) {
        $.post(route, $.param({ post_id: post_id }));
      }

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