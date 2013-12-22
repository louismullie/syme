Syme.Binders.add('feed', { posts: function(){

  // Delete post/comment toggling
  $('#main').on({
    mouseenter: function(){
      $(this).find('a.post-delete, a.comment-delete').first()
        .css({ display: 'block' })
        .transition({ opacity: 1}, 100);
    },
    mouseleave: function(){
      $(this).find('a.post-delete, a.comment-delete').first()
        .transition({ opacity: 0}, 100)
        .css({ display: 'none' });
    }
  }, 'div.post-header, div.comment-box');

  // Delete post
  $('#main').on('click', '.post-header a.post-delete', function() {

      var postId    = $(this).closest('.post').attr('id');
      var deletePostUrl = Syme.Url.fromCurrentGroup('posts', postId);

      Confirm.show(
        'Do you really want to delete this post?',
        {
          closable: true,
          title: 'Delete post',
          submit: 'Delete',
          cancel: 'Cancel',

          onsubmit: function() {

            $.encryptedAjax(deletePostUrl, {

              type: 'DELETE',

              success: function () {

                if ($('#feed').data('single-post')) {

                  var userId = Syme.CurrentSession.getUserId(),
                      groupId = Syme.CurrentSession.getGroupId();

                  var route = Syme.Url.join('users', userId, 'groups', groupId);

                  Syme.Router.navigate(route);

                } else {

                  Syme.Socket.delete.post({ target: postId });

                }

              },

              error: function (response) {
                Syme.Error.ajaxError(response, 'delete', 'post');
              }

            });

          }
        }
      );

  });

  // Link every encrypted file on the page.
  $('#main').on('click', '.encrypted-file', function() {

    var $link = $(this);

    // Follow link if file has already been decrypted
    if( !!$link.attr('download') ) return;

    // Do nothing if file is decrypting, but lock link otherwise.
    if( $link.data('decrypting') ) return; $link.data('decrypting', true);

    // Gather needed informations
    var attachmentId  = $link.data('attachment-id'),
        keys          = $link.data('attachment-keys'),
        filename      = $link.data('attachment-filename'),
        groupId       = Syme.CurrentSession.getGroupId();

    // Lock link
    $link.data('decrypting', true).addClass('decrypting');

    // Retrieve file
    var fileInfo = Syme.FileManager.buildFileInfo(attachmentId, groupId, keys);

    Syme.FileManager.getFile(fileInfo, function (url) {

      // Update link for further downloads
      $link.attr('href', url).attr('download', filename);

      // Automatically download
      Syme.FileManager.saveToDisk(url, filename);

      // Unlock link
      $link.data('decrypting', false).removeClass('decrypting');

    });

  });

  // Shortcut for image attachment links
  $('#main').on('click', 'a.image-download', function() {

    NProgress.showSpinner();

    var id        = $(this).data('attachment-id'),
        filename  = $(this).data('attachment-filename'),
        keys      = $(this).data('attachment-keys'),
        group     = $(this).data('attachment-group');

    var callback = function (url) {

      NProgress.hideSpinner();

      if (!url) return;

      Lightbox.show(url);

    };

    var file = Syme.FileManager.buildFileInfo(id, group, keys);

    Syme.FileManager.getFile(file, callback);

  });

  // Likes
  $('#main').on('click', '.like-action', function(e){

    var post_id     = $(this).closest('.post').attr('id'),
        comment_id  = $(this).closest('.comment-box').attr('id'),
        type        = comment_id ? 'comment' : 'post',
        op          = $(this).hasClass('active') ? 'delete' : 'create',
        group       = Syme.CurrentSession.getGroupId(),
        route       = SERVER_URL + '/' + group + '/' + type + '/like/' + op;

    $.ajax(route, {
      type: 'POST',
      data: { post_id: post_id, comment_id: comment_id }
    });

  });

} }); // Syme.Binders.add();