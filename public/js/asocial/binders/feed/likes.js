asocial.binders.add('feed', { likes: function(){

  $('#main').on('click', '.like-action', function(e){

    var post_id = $(this).closest('.post').attr('id'),
        op      = $(this).hasClass('active') ? 'delete' : 'create',
        group   = asocial.binders.getCurrentGroup(),
        route   = '/' + group + '/post/like/' + op;

    $.post(route, { post_id: post_id });

  });

  // Comment like/unlike.

  $('#main').on('click', '.comment-likes', function(e){

    var post_id    = $(this).closest('.post').attr('id'),
        comment_id = $(this).closest('.comment-box').attr('id'),
        op         = $(this).hasClass('active') ? 'delete' : 'create',
        group      = asocial.binders.getCurrentGroup(),
        route      = '/' + group + '/comment/like/' + op;

    $.post(route, { post_id: post_id, comment_id: comment_id });

  });

} }); // asocial.binders.add();