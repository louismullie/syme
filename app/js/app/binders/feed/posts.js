Binders.add('feed', { posts: function(){

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

      var post_id    = $(this).closest('.post').attr('id'),
          group      = CurrentSession.getGroupId(),
          route      = SERVER_URL + '/' + group + '/post/delete';

      Confirm.show(
        'Do you really want to delete this post?',
        {
          closable: true,
          title: 'Delete post',
          submit: 'Delete',
          cancel: 'Cancel',

          onsubmit: function(){
            $.post(route, { post_id: post_id });
          }
        }
      );

  });

  // Link every encrypted file on the page.
  $('#main').on('click', '.encrypted-file', function() {

    var link     = $(this),
        progress = link.parent().find('span');

    // Do nothing if file is decrypting
    if(link.data('decrypting')) return false;

    // Lock link
    link.html('<i class="icon-cog icon-spin"></i>&nbsp;Decrypting')
        .addClass('decrypting')
        .data('decrypting', true);

    var id       = link.data('attachment-id');
    var filename = link.data('attachment-filename');
    var keys      = link.data('attachment-keys');

    FileManager.getFile(id, keys, function (url) {

      if (!url) return progress.remove();
      
      link.attr('href', url)
          .attr('download', filename)
          // Change link status
          .html('<i class="icon-arrow-down"></i>&nbsp;Download')
          .removeClass('decrypting')
          // Unbind decryption
          .off('click');

      link.closest('.attachment').find('a.image-download')
          .attr('href', url)
          .attr('download', filename);
      
      
      link.on('click', function () {
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        
        xhr.onload = function(e) {
          if (this.status == 200) {
            var blob = this.response;
            saveAs(blob, filename);
          }
        };
        
        xhr.send();
        
      });

      progress.remove();

    });


  });

  // Shortcut for image attachment links
  $('#main').on('click', 'a.image-download', function() {

    // Show mofo spinner
    var spinner = setTimeout(function () { $('#spinner').show(); }, 500);

    var id       = $(this).data('attachment-id');
    var filename = $(this).data('attachment-filename');
    var keys      = $(this).data('attachment-keys');

    FileManager.getFile(id, keys, function (url) {
      
      clearTimeout(spinner); $('#spinner').hide();
      
      if (!url) return;
      
      Lightbox.show(url);
      
    });

  });

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


} }); // Binders.add();