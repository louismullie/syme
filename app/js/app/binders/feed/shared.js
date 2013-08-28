Binders.add('feed', { shared: function(){

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

    // Get list in the form [*{ id: string, name: string }]
    var mentionList = $.parseJSON( $('#mentioned_users').attr('data-list') );

    // Reject current user from list
    // var currentUserId = CurrentSession.getUserId();
    // mentionList = _.reject(mentionList, function (user) {
    //   return user.id == currentUserId;
    // });

    $(this).mentionsInput({
      onDataRequest:function (mode, query, callback) {

        var data = _.filter(mentionList, function(item) {
          return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
        });

        callback.call(this, data);

      }
    });

  });

  // Form feed textarea formatting (should stay here because
  // of dependency order)
  $('#feed-form textarea').trigger('format');

  // Reset textarea
  $('#main').on('reset', 'textarea', function(e){
    $(this)
      // Clear and reset height
      .val('').trigger('autogrow.reset')
      // Remove mentions
      .parent().find('.mentions div').html('');
  });

} }); // Binders.add();