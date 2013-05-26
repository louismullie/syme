asocial.binders.add('feed', { feed: function(){

  asocial.state.getState('invite', function (authorized) {
    
    if (!authorized) { alert('Not authorized for invite!'); }
    
    if (asocial.state.invite.integrate) {
      asocial.invite.integrate();
    }

    if (asocial.state.invite.update) {
      asocial.invite.update();
    }

  }, { group: asocial.state.group.name });

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

  // Delete post
  $('#main').on('click', '.post-content a.post-delete', function() {

      var post_id    = $(this).closest('.post').attr('id'),
          group      = asocial.binders.getCurrentGroup(),
          route      = '/' + group + '/post/delete';

      if(confirm(locales.en.feed.delete_comment_confirm)) {
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

  $('#invite').submit(function (e) {

    e.preventDefault();
    
    // Get data from form.
    var email = $(this).find('input[name="email"]').val();
    
    asocial.auth.getPasswordLocal(function (password) {

      // 1A: !(P, p).
      var keys = asocial.crypto.generateRSA(true);

      // 1B: !sB
      var sB_salt = asocial.crypto.generateRandomHexSalt();
      var sB = asocial.crypto.calculateHash(password, sB_salt);

      // 1C: p -> {p}sB
      var P = $.base64.encode(JSON.stringify(keys.public_key));
      var p = $.base64.encode(JSON.stringify(keys.private_key));
      var p_sB = $.base64.encode(sjcl.encrypt(sB, p));
      
      // Build invitation.
      var invitation = $.param({
        email: email,
        P: P, p_sB: p_sB,
        sB_salt: sB_salt
      });

      // 1D: B -> R: (P, {p}sB)
      var group = asocial.binders.getCurrentGroup();
      
      $.post('/' + group + '/invite/send', invitation, function (data) {
        $('.invited-user').removeClass('hidden');
        $('.invite-user').addClass('hidden');
      });
      
    });

  });
  

} }); // asocial.binders.add();