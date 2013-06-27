asocial.binders.add('feed', { likes: function(){

  $('#main').on('click', '.like-action', function(e){

    var post_id     = $(this).closest('.post').attr('id'),
        comment_id  = $(this).closest('.comment-box').attr('id'),
        type        = comment_id ? 'comment' : 'post',
        op          = $(this).hasClass('active') ? 'delete' : 'create',
        group       = asocial.state.group.id,
        route       = 'http://localhost:5000/' + group + '/' + type + '/like/' + op;

    $.post(route, { post_id: post_id, comment_id: comment_id });

  });

} }); // asocial.binders.add();