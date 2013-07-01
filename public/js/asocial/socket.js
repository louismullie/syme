guard('socket', {

  // BEGIN CUD OPERATIONS
  updatedPosts: 0,
  updatedComments: 0,

  request: {

    invite: function(data) {

     // Nothing for now

    }

  },

  confirm: {

    invite: function(data) {

      asocial.state.getState('invite', function (authorized) {

        //asocial.helpers.showAlert('UPDATING KEYS');

        if (!authorized) { asocial.helpers.showAlert('Not authorized for invite!'); }
        asocial.invite.update();

      }, { group_id: data.group_id });

    }

  },

  create: {

    error: function(data) {
      $('#feed').prepend('<div class="alert alert-error">' +
      '<button type="button" class="close" data-dismiss="alert">' +
      '&times;</button>' + data.message + '</div>');
    },

    post: function(post){

      // Remove empty group notice if there is one
      $('.empty-group-notice').remove();

      // Render post with the data
      var postHtml = $(asocial.helpers.render('feed-post', post.view));

      var owner = post.view.owner.id;

      // If the post owner isn't the user.
      if (owner != CurrentSession.getUserId()) {
        // Increment unread_posts variable
        asocial.helpers.newContent('post');

        postHtml.addClass('hidden');
      }

      // Append hidden new post
      postHtml.insertAfter($('#newcontent'));

      // Autogrow comment textarea
      $('textarea.autogrow').autogrow().removeClass('autogrow')

    },

    comment: function(data){

      // If related post doesn't exist on page
      if($('#' + data.target).length) {

        var post               = $('#' + data.target),
            container          = post.find('.comments'),
            showmore           = container.find('.show-more'),
            showmore_count     = showmore.find('span'),
            displayed_comments = container.find('.comment-box').not('.comment-hidden');

        // If comments are still collapsed and they are full
        if( !showmore.data('expanded') && displayed_comments.length >= 3 ){

          // Hide first displayed comment
          displayed_comments.first().addClass('comment-hidden');

          // Show and increment showmore counter
          showmore.removeClass('hidden');
          showmore_count.html(container.find('.comment-hidden').length);

        }

        // Append new comment
        container.append(asocial.helpers.render('feed-comment', data.view));

        // Reset comment count counter
        post.find('[partial="feed-comment-count"]')
          .renderHbsTemplate({ comment_count: post.find('.comment-box').length });

      } else {

        // If related post doesn't exist, increment new content
        asocial.helpers.newContent('comment');

      }

    },

    notification: function(data){

      if ($('#notifications-content').children().length == 0 ||
          $('.empty-notification').first().attr('class') == 'empty-notification') {
        $('#notifications-content').html('');
        $('#notifications').prepend('<span class="notification-badge">1</a>');
      } else {
        $('.notification-badge').html(parseInt($('.notification-badge').html()) + 1);
      }

      data.html = asocial.helpers.notificationText(data);

      var html = asocial.helpers.render('feed-notification', data);

      $('#notifications-content').prepend(html);
      asocial.crypto.decryptAvatars();

      // Update the notifications counter.
      //$('#notifications-button span').html(new_notifications.count);


    },

    user: function (data) {

      // Force all clients to reload to get new public key
      Router.reload();

    }

  },

  update: {

    // This will be updated in JSON, data is of the form:
    // { target: post_or_comment_id, view: { has_likes: bool, like_count: int,
    //   liked_by_user: bool, liker_names: string  } }

    like: function(data){

      var target       = $('#' + data.target),
          action_link  = target.find('a.like-action').first();

      // Toggle action link
      data.view.liked_by_user ?
        action_link.addClass('active') :
        action_link.removeClass('active');

      // Update list of names and counter
      target.find('[partial="feed-like-count"]').first()
        .renderHbsTemplate({ likeable: data.view });
    },

    notification: function(data){

      var html = asocial.helpers.render('feed-notification', data);

      $('#notifications-content')
        .find('#' + data.id)
        .replaceWith(html);

    }
  },

  delete: {

    post: function(data){

      // If post is on the page yet
      if($('#' + data.target).length > 0){

        var group = CurrentSession.getGroupId();
        var url = 'http://localhost:5000/' + group + '/post/lastof/';

        $.get(url + $('#feed').data('pagesloaded'),
        function(data){ $('#feed').append(data); });

      }

      // Remove the post
      $('#' + data.target).remove();
    },

    comment: function(data){

      var comment           = $('#' + data.target),
          comment_container = comment.closest('.comments'),
          comments          = comment_container.find('.comment-box');

      // Remove comment
      comment.remove();

      // Update and create collections after removal of comment
      var comments        = comments.not('#' + data.target),
          comments_hidden = comments.filter('.comment-hidden'),
          showmore        = comment_container.find('.show-more'),
          showmore_count  = showmore.find('span');

      // If comments are still collapsed
      if(showmore.is(':visible')){

        // If the removed comment was visible
        if(comments.not('.comment-hidden').length < 3){
          // Make the last hidden comment visible
          comments_hidden.last().removeClass('comment-hidden');

          // Update hidden comments collection
          comments_hidden = comments.filter('.comment-hidden');
        }

        // If there are still hidden comments
        if(comments_hidden.length){
          // Update show-more
          showmore_count.html(comments_hidden.length);
        }else{
          // Otherwise, hide show-more
          showmore.addClass('hidden');
        }

      } else {
        if(comments.length <= 3) {
          showmore.data('expanded', false);
        }
      }

      // Reset comment count counter
      comment_container.closest('.post').find('[partial="feed-comment-count"]')
        .renderHbsTemplate({ comment_count: comments.length });

    },

    notification: function (data) {
      $('#' + data.target).remove();

      if ($('#notifications-content').children().length == 0) {
        $('#notifications-content').html(
          asocial.helpers.render('feed-notifications-empty'));
      }
    }

  },

  send: {

    file: function (data) {

      // var buffers = {};
      var group = CurrentSession.getGroupId();

      if (data.action == 'request') {

        var sentence = ' would like to send you the following file: ';
        var filename = asocial.helpers.getFilename(data.filename);

        asocial.helpers.showAlert(data.sender_name + sentence + filename);

        $.post('http://localhost:5000/send/file/accept', $.param({
          transfer_id: data.transfer_id, group_id: group
        }));

      } else if (data.action == 'accept') {

        var recipient = $('#' + data.recipient_id)
        var file = recipient.find('input[type="file"]')[0].files[0];
        asocial.uploader.uploadTransfer(file, data.transfer_id);

      } else if (data.action == 'start') {

        var downloader = new Downloader(
          data.upload.id, data.upload.key
        );

        downloader.start(
          function(number) { },
          function(blob) {
            if(confirm('Click OK to download.')) {
              saveAs(blob, data.upload.filename);
            }
          }
        );

      } else if (data.action == 'refuse') {
        asocial.helpers.showAlert(data.reason);
      }

    },

    message: function (data) {
      asocial.helpers.showAlert(data.sender.name + ' sent message: ' + data.message);
    }

  },

  // END CUD OPERATIONS

  // Socket updates dispatcher

  receiveUpdate: function(data){

    // Check corresponding function existence
    if(!this[data.action][data.model]){
      console.log('asocial.socket.' + data.action +
            '.' + data.model + '() doesn\'t exist');
      return false;
    }

    // Call it and pass the relevant data to it
    // Example: given operation = "delete" and model = "like", we call:
    // asocial.socket.delete.like(data.data)
    this[data.action][data.model](data.data);

    // Decrypt anything new.
    if(data.action != 'delete')
      asocial.crypto.decrypt();

  },

  tries: 0,

  listen: function() {

    if (typeof(window.tries) == 'undefined') {
      window.tries = 0;
    }

    var _this = this;

    try {

      if (typeof(document.eventSource) == 'undefined' ||
         document.eventSource.readyState != 1) {

        document.eventSource = new EventSource('http://localhost:5000/users/' +
        CurrentSession.getUserId() + '/stream');

        document.eventSource.onmessage = function(e) {

          var json = $.parseJSON(e.data);
          console.log('Socket action: ' + json.action + '.' + json.model);
          _this.receiveUpdate(json);

        };

        document.eventSource.onclose = function(e) {
          if (window.tries < 100) {
            console.log('Socket closed. Attempting reconnect.');
            _this.checkListen();
          } else {
            console.log('Socket FAIL after three reconnects.');
            document.eventSource.close();
          }
        };

      }
    } catch(exception){
      console.log(exception);
    }

  },

  checkListen: function () {

    window.tries += 1;

    if (typeof(document.eventSource) != 'undefined' &&
       document.eventSource.readyState == 2) { this.listen(); }

  }

});