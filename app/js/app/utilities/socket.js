Syme.Socket = {

  hangout: {

    create: function (data) {

      var hangoutId = data.id;

      Confirm.show(

        Syme.Template.render('hangout'),
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
      Modal.show(data.recipient_name +
        ' declined your request to video chat.');
    },

    start: function (data) {

      Syme.Hangout.start(data);

    }

  },

  invitation: {

    distribute: function (data) {

      Notifications.fetch();

      var user = Syme.CurrentSession.getUser();
      var groupId = data.group_id;
      var callback = function () {};

      user.getAllGroupUpdates(callback);

    }

  },

  create: {

    post: function(post, decrypted){

      // Don't display a post in the wrong group
      if (post.view.group_id != Syme.CurrentSession.getGroupId()) return;

      // If post already exists, return.
      if ($('#' + post.view.id).length) return;

      // Remove empty group notice if there is one
      $('#empty-group-notice').remove();

      // Render post with the data
      var $post = $(Syme.Template.render('feed-post', post.view));

      // If the post owner isn't the user.
      if (post.view.owner.id != Syme.CurrentSession.getUserId()) {

        // Increment unread_posts variable
        Syme.Helpers.newContent('post', post.view.group_id);

        $post.addClass('new-post');

      }

      // Append hidden new post
      $post.insertAfter( $('#newcontent') );

      // Decrypt
      if(decrypted){
        $post.trigger('format');
      } else {
        Syme.Decryptor.decryptPostsAndComments($post);
      }

    },

    comment: function(data, decrypted){

      var $post             = $('#' + data.target),
          $commentContainer = $post.find('.comments');

      // If related post doesn't exist, increment new content
      if(!$post.length)
        return Syme.Helpers.newContent('comment', data.view.group_id);

      // Just return if the comment has already been displayed.
      if ( $('#' + data.view.id).length ) return;

      // Append new comment
      var $comment = $(Syme.Template.render('feed-comment', data.view));
      $commentContainer.append( $comment );

      // Format or decrypt
      if (decrypted) {

        // If comment is already decrypted
        $commentContainer.trigger('organize');            // Organize container
        $comment.trigger('format');                       // Format comment

      } else {

        // If comment is not already decrypted
        Syme.Decryptor.decryptPostsAndComments($comment, function(){  // Decrypt comment
          $commentContainer.trigger('organize');                      // Organize container
        });

      }

    },

    notification: function(data){

      // Refresh if on group UI and invite state changes.
      if (data.action == 'invite_confirm' ||
          data.action == 'invite_request' ||
          data.action == 'invite_cancel'  ||
          data.action == 'leave_group') {

        Syme.Cache.delete('groups');

        if (!Syme.Router.insideGroup())
          Syme.Router.reload();

      }

      if (data.action == 'invite_decline' ||
          data.action == 'leave_group') {

        if (Syme.Router.insideGroup())
          Syme.Router.reload();

      }

      // Refresh if inside group and invite state changes.
      if (Syme.Router.insideGroup() &&
          data.action == 'invite_accept' &&
          Syme.CurrentSession.getGroupId() == data.group_id)
        Syme.Router.reload();

      Notifications.add(data);

      if (Syme.Compatibility.inChromeExtension()) {

        function strip(html)
        {
           var tmp = document.createElement("DIV");
           tmp.innerHTML = html;
           return tmp.textContent || tmp.innerText || "";
        }

        var message = strip(Notifications.view
          .generateNotificationText(data).message);

        function openApp() {

          var symeUrl = chrome.extension.getURL('syme.html');
          chrome.tabs.create( {'url': symeUrl }, function(tab) { });

        }

        function notify(message) {

          var havePermission = window.webkitNotifications.checkPermission();

          if (havePermission == 0) {

            var notification = window.webkitNotifications.createNotification(
              'https://getsyme.com/img/logo-48x48.png',
              'New activity on Syme', message
            );

            notification.onclick = function () {
              openApp();
              notification.close();
            }

            setTimeout(function(){
              notification.cancel();
            }, 2000);

            notification.show();

          } else {

            window.webkitNotifications.requestPermission();

          }

        }

        notify(message);


     }

    },

    user: function (data) {

      // Force all clients to reload to get new public key
      Syme.Router.reload();

    },

    group: function (data) {
      Syme.CurrentSession.getUser().refreshKeyfile(Syme.Router.reload);
    }
  },

  update: {

    like: function(data){

      var target       = $('#' + data.target),
          action_link  = target.find('a.like-action').first();

      // Return if concerned element doesn't exist
      if(!target.length) return;

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

      if (notification) notification.set(data);

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

      // If post isn't on the page yet, return
      if( !$('#' + data.target).length ) return false;

      // Remove the post
      $('#' + data.target).remove();

      var group       = Syme.CurrentSession.getGroupId(),
          currentPage = $('#feed').prop('scroller').loadedPages,
          url         = SERVER_URL + '/' + group + '/post/lastof/' + currentPage;

      $.get(url, function(post) {

        // Generate post template and append it to feed
        var $post = $( Syme.Template.render('feed-post', post) );
        $('#feed').append($post);

        // Decrypt it
        Syme.Decryptor.decryptPostsAndComments($post);

      });


    },

    comment: function(data){

      var $comment            = $('#' + data.target),
          $commentContainer   = $comment.closest('.comments');

      // Remove comment
      $comment.remove();

      // Organize comments
      $commentContainer.trigger('organize');

    },

    notification: function (data) {
      Notifications.fetch();
    },

    group: function (data) {

      var groupId = data.id;

      Notifications.reset();
      Notifications.fetch();

      if (Syme.Router.insideGroup() &&
          Syme.CurrentSession.getGroupId() == groupId);
        Syme.Router.navigate('');

      return;

    }
  },

  send: {

    file: function (data) {

      // var buffers = {};
      var group = Syme.CurrentSession.getGroupId();

      if (data.action == 'request') {

        var sentence = ' would like to send you the following file: ';
        var filename = Syme.FileManager.getFilename(data.filename);

        Alert.show(data.sender_name + sentence + filename);

        $.post(SERVER_URL + '/send/file/accept', {
          transfer_id: data.transfer_id, group_id: group
        });

      } else if (data.action == 'accept') {

        var recipient = $('#' + data.recipient_id)
        var file = recipient.find('input[type="file"]')[0].files[0];
        Syme.FileManager.uploadTransfer(file, data.transfer_id);

      } else if (data.action == 'start') {

        // Deprecated calling form
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
        Alert.show(data.reason);
      }

    },

    message: function (data) {
      Alert.show(data.sender.name + ' sent message: ' + data.message);
    }

  },

  // END CUD OPERATIONS

  // Socket updates dispatcher

  receiveUpdate: function(data){

    // Check that the relevant handler exists.
    if(!this[data.action][data.model]){
      throw 'Syme.Socket.' + data.action +
            '.' + data.model + '() doesn\'t exist';
      return false;
    }

    // Call it and pass the relevant data to it.
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
        Syme.CurrentSession.getUserId() + '/stream');

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

};
