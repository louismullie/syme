Syme.Binders.add('feed', { shared: function(){

  // Likes
  $('#main').on('click', '.like-action', function(e){

    var post_id     = $(this).closest('.post').attr('id'),
        comment_id  = $(this).closest('.comment-box').attr('id'),
        type        = comment_id ? 'comment' : 'post',
        op          = $(this).hasClass('active') ? 'delete' : 'create',
        group       = Syme.CurrentSession.getGroupId(),
        route       = SERVER_URL + '/' + group + '/' + type + '/like/' + op;

    $.post(route, { post_id: post_id, comment_id: comment_id });

  });

  // Mentions and autogrow
  $('#main').on('formatTextarea', 'textarea', function(e){

    e.stopPropagation();

    // Get list in the form [*{ id: string, name: string }]
    var mentionList = $.parseJSON( $('#mentioned_users').attr('data-list') );

    // Reject current user from list
    var currentUserId = Syme.CurrentSession.getUserId();
    mentionList = _.reject(mentionList, function (user) {
      return user.id == currentUserId;
    });

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
  $('#feed-form textarea').trigger('formatTextarea');

  // Reset textarea
  $('#main').on('reset', 'textarea', function(e){

    e.stopPropagation();

    $(this)
      // Clear and reset height
      .val('').trigger('autogrow.reset')
      // Remove mentions
      .parent().find('.mentions div').html('');

  });

  // Get textarea value with mentions markup along with mention list.
  // Calls callback({ text: string, mentioned_users: [ *id (string) ] })
  $('#main').on('getMentionsMarkup', 'textarea', function(e, callback){

    e.stopPropagation();

    var $this = $(this);

    $this.mentionsInput('val', function(text) {
      $this.mentionsInput('getMentions', function(mentioned_users) {

        // Keep ids only
        var mentioned_users = _.map(mentioned_users, function(mentioned_user){
          return mentioned_user.id;
        })

        callback({ text: text, mentioned_users: mentioned_users});

      });
    });

  });

} }); // Binders.add();