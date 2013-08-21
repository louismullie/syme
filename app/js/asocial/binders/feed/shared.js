asocial.binders.add('feed', { shared: function(){

  // Likes
  $('#main').on('click', '.like-action', function(e){

    var post_id     = $(this).closest('.post').attr('id'),
        comment_id  = $(this).closest('.comment-box').attr('id'),
        type        = comment_id ? 'comment' : 'post',
        op          = $(this).hasClass('active') ? 'delete' : 'create',
        group       = CurrentSession.getGroupId(),
        route       = SERVER_URL + '/' + group + '/' + type + '/like/' + op;

    $.post(route, { post_id: post_id, comment_id: comment_id });

  });

  // Mentions and autogrow
  $('#main').on('format', 'textarea', function(e){

    var mention_list = $('#mentioned_users').attr('data-list');

    $(this).mentionsInput({
      onDataRequest:function (mode, query, callback) {

        var data = _.filter(mention_list, function(item) {
          return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
        });

        callback.call(this, data);

      }
    });

  });

} }); // asocial.binders.add();