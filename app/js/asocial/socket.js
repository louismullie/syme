guard('socket', {

  hangout: {
    
    create: function (data) {
      
      var hangoutId = data.id;
      
      asocial.helpers.showConfirm(
        
        asocial.helpers.render('hangout'), 
        {
          title: 'Video chat with Louis Mullie',
          closable: false,
          submit: 'Accept',
          cancel: 'Decline',
          
          onsubmit: function () {
            
            $.ajax('/hangouts', {
              type: 'PUT',
              data: {
                hangout_id: hangoutId,
                accept: true
              },
              success: function () {
              },
              error: function () {
                alert('Could not accept hangout!');
              }
              
            });
            
          },
          
          onhide: function () {
            
            $.ajax('/hangouts', {
              type: 'PUT',
              data: { 
                hangout_id: hangoutId,
                accept: false
              },
              success: function () { },
              error: function () {
                alert('Could not decline hangout!');
              }
              
            });
            
          }
          
      });
      
    },
    
    decline: function (data) {
      asocial.helpers.showModal(data.recipient_name +
        ' declined your request to video chat.');
    },
    
    start: function (data) {
      
      asocial.hangout.start(data);
      
    }
  
  },
  
  invitation: {

    distribute: function (data) {

      var user = CurrentSession.getUser();
      var groupId = data.group_id;
      var callback = function () {};

      user.getGroupUpdates(groupId, callback);

    }

  },

  create: {

    post: function(post){

      // Remove empty group notice if there is one
      $('#empty-group-notice').remove();

      // Render post with the data
      var template = $(asocial.helpers.render('feed-post', post.view));

      var owner = post.view.owner.id;

      // If the post owner isn't the user.
      if (owner != CurrentSession.getUserId()) {

        // Increment unread_posts variable
        asocial.helpers.newContent('post', post.view.group_id);

        template.addClass('new-post');
      }

      // Append hidden new post
      template.insertAfter($('#newcontent'));

      // Decrypt
      asocial.crypto.batchDecrypt();

      // Autogrow comment textarea
      $('textarea.autogrow').autogrow().removeClass('autogrow')

    },

    comment: function(data){

    // If related post doesn't exist, increment new content
    if(!$('#' + data.target).length)
      return asocial.helpers.newContent('comment', data.view.group_id);

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

      // Decrypt
      asocial.crypto.batchDecrypt();

      // Reset comment count counter
      post.find('[partial="feed-comment-count"]')
        .renderHbsTemplate({ comment_count: post.find('.comment-box').length });

    },

    notification: function(data){

      // Refresh if on group UI and invite state changes.
      if (!Router.insideGroup() && (
          data.action == 'invite_confirm' ||
          data.action == 'invite_request' ||
          data.action == 'invite_cancel'))
        Router.reload();
      
      // Refresh if inside group and invite state changes.
      if (Router.insideGroup() && 
          data.action == 'invite_accept' &&
          CurrentSession.getGroupId() == data.group_id)
        Router.reload();
      
      Notifications.add(data);

    },

    user: function (data) {

      // Force all clients to reload to get new public key
      Router.reload();

    },

    group: function (data) {
      CurrentSession.getUser().refreshKeyfile(Router.reload);
    }
  },

  update: {

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

      var notification = Notifications.get(data.id);
      
      if (notification)
        notification.set(data);

    },

    group_avatar: function (data) {

      // Change photo
      $('#group-photo-edit[data-group-id="' + data.group_id + '"] img')
        .attr('data-attachment-id', data.id)
        .attr('data-attachment-keys', data.keys)
        .trigger('decrypt');

    },

    user_avatar: function (data) {

      // Change master
      $('.user-avatar[data-user-id="' + data.owner_id + '"]')
        .attr('data-avatar-id', data.id)
        .attr('data-keys', data.keys)
        .trigger('decrypt');

      // Sync slaves
      $('.slave-avatar[data-user-id="' + data.owner_id + '"]')
        .trigger('sync');

    }

  },

  delete: {

    post: function(data){

      // If post is on the page yet
      if($('#' + data.target).length > 0){

        var group = CurrentSession.getGroupId();
        var url = SERVER_URL + '/' + group + '/post/lastof/';

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
      Notifications.fetch();
    },
    
    group: function (data) {
      
      var groupId = data.id;
      
      Notifications.reset();
      Notifications.fetch();
      
      if (Router.insideGroup() &&
          CurrentSession.getGroupId() == groupId);
        Router.navigate('');
      
      return;
      
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

        $.post(SERVER_URL + '/send/file/accept', $.param({
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
      throw 'asocial.socket.' + data.action +
            '.' + data.model + '() doesn\'t exist';
      return false;
    }

    // Call it and pass the relevant data to it
    // Example: given operation = "delete" and model = "like", we call:
    // asocial.socket.delete.like(data.data)
    this[data.action][data.model](data.data);

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

        document.eventSource = new EventSource(SERVER_URL + '/users/' +
        CurrentSession.getUserId() + '/stream');

        document.eventSource.onmessage = function(e) {

          var json = $.parseJSON(e.data);
          _this.receiveUpdate(json);

        };

        document.eventSource.onclose = function(e) {
          if (window.tries < 100) {
            _this.checkListen();
          } else {
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