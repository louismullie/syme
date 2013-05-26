guard('socket', {

  // BEGIN CUD OPERATIONS
  updatedPosts: 0,
  updatedComments: 0,
  
  request: {

    invite: function(data) {

      alert('Somebody has requested an invite!');

    }

  },
  
  confirm: {

    invite: function(data) {

      asocial.state.getState('invite', function (authorized) {

        //alert('UPDATING KEYS');

        if (!authorized) { alert('Not authorized for invite!'); }
        asocial.invite.update();

      }, { group: data.group });

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
      var postHtml = $(Fifty.render('feed-post', post.view));

      var owner = post.view.owner.id;
      console.log(owner);

      // If the post owner isn't the user.
      if (owner != asocial.state.user.id) {
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
      if($('#' + data.target).length == 0){

        asocial.helpers.newContent('comment');

      // If it exists
      } else {

        var post               = $('#' + data.target),
            global_count       = post.find('.post-comments span'),
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
        container.append(Fifty.render('feed-comment', data.view));

        // Reset comment count counter
        global_count.html( post.find('.comment-box').length );

        // Decrypt new comment
        asocial.crypto.decryptPostsAndComments();

      }

    },

    notification: function(data){
      
      var html = Fifty.render('feed-notification', {
        html: asocial.helpers.notificationText(data),
        avatar: data.avatar,
        id: data.id
      });
      
      $('#notifications-content').prepend(html);
      asocial.crypto.decryptAvatars();
      
      // Update the notifications counter.
      //$('#notifications-button span').html(new_notifications.count);


    },

    user: function (data) {

      // Force all clients to reload to get new public key
      window.location.reload();

    }

  },

  update: {

    // This will be updated in JSON, data is of the form:
    // { target: post_or_comment_id, view: { has_likes: bool, like_count: int,
    //   liked_by_user: bool, liker_names: string  } }

    like: function(data){

      console.log('New like:', data);

      var link    = $('#' + data.target).find('a.post-likes, a.comment-likes').first(),
          counter = link.find('span');

      if(data.view.like_count > 0) {
        counter.html(data.view.like_count);
        link.attr('data-tip', data.view.liker_names);
      } else {
        counter.html('');
        link.removeAttr('data-tip');
      }

      // Toggle the like link
      data.view.liked_by_user ? link.addClass('active') : link.removeClass('active');

    },

    notification: function(data){

      var html = Fifty.render('feed-notification', data);

      $('#notifications-content')
        .find('#' + data.id)
        .replaceWith(html);

    }
  },

  delete: {

    post: function(data){

      // If post is on the page yet
      if($('#' + data.target).length > 0){

        var group = asocial.binders.getCurrentGroup();
        var url = '/' + group + '/post/lastof/';

        $.get(url + $('#feed').data('pagesloaded'),
        function(data){ $('#feed').append(data); });

      }

      // Remove the post
      $('#' + data.target).remove();
    },

    comment: function(data){

      var comment           = $('#' + data.target),
          comment_container = comment.closest('.comments'),
          comments          = comment_container.find('.comment-box'),
          global_count      = comment_container.closest('.post').find('.post-comments span');

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
      }

      // If there are no more comments, hide comment box
      if( comments.length == 0 ){
        comment_container.addClass('hidden');
      }

      // Reset comment count counter
      global_count.html( comments.length );

    },
    
    notification: function (data) {
      $('#' + data.target).remove();
      
      if ($('#notifications-content').children().length == 0) {
        $('#notifications-content').html(
          Fifty.render('feed-notifications-empty'));
      }
    }
    
  },

  send: {

    file: function (data) {

      // var buffers = {};
      var group = asocial.binders.getCurrentGroup();

      if (data.action == 'request') {

        var sentence = ' would like to send you the following file: ';
        var filename = asocial.helpers.getFilename(data.filename);

        alert(data.sender_name + sentence + filename);

        $.post('/send/file/accept', $.param({
          transfer_id: data.transfer_id, group: group
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
        alert(data.reason);
      }

    },

    message: function (data) {
      alert(data.sender.name + ' sent message: ' + data.message);
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

  listen: function() {

    var _this = this;

    try {

      if (typeof(document.eventSource) == 'undefined' ||
         document.eventSource.readyState != 1) {

        document.eventSource = new EventSource('/stream');

        document.eventSource.onmessage = function(e) {
          var json = $.parseJSON(e.data);
          console.log('Socket action: ' + json.action + '.' + json.model);
          _this.receiveUpdate(json);
        };

        document.eventSource.onclose = function(e) {
          console.log('Socket closed. Attempting reconnect.');
          _this.checkListen();
        };

        document.eventSource.onerror = function (e) {
          console.log('Socket error.');
        };

      }
    } catch(exception){
      console.log('asocial.socket | error: ');
      console.log(exception);
    }

  },

  checkListen: function () {
    if (typeof(document.eventSource) != 'undefined' &&
       document.eventSource.readyState == 2) {
      this.listen();
    }
  }

});