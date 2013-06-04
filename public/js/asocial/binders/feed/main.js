asocial.binders.add('feed', { main: function(){

  // Decryption
  asocial.crypto.decrypt();

  // Initial textarea autosizing
  $('textarea.autogrow').autogrow().removeClass('autogrow');

  // ScrollToFixed
  $('#group-info').scrollToFixed({ marginTop: 20 });

  // Infinite scroller
  $('#feed').data('pagesloaded', 1);

  // Group photo
  $('.group-avatar').on('click', function () {
    $('#group-avatar-file-input').trigger('click');
  });

  $('#group-avatar-file-input').on('change',function(){

    var filename = asocial.helpers.getFilename($(this).val());
    if (filename == '') { return; }

    asocial.uploader.selectGroupAvatar($(this)[0].files[0]);

  });

  $(window).on('scroll', function(){

    if($(window).data('infinite-scroll-done'  )  ||
       $(window).data('infinite-scroll-async' )  ||
       $(window).data('infinite-scroll-manual')) return;

    if($(window).scrollTop() >= $(document).height() - $(window).height() - 50){

      // Lock semaphore before AJAX request
      $(window).data('infinite-scroll-async', true);

      // Creates an array containing all showed posts
      var showed_posts_id = Array();

      $.each($('.post'), function(index, value){
        showed_posts_id.push($(this).attr('id'));
      });

      // Increment feed's state
      var toload = $('#feed').data('pagesloaded') + 1;

      // Build post request
      var request = {
        // Post a list of already showed posts to prevent duplication
        'ignore': showed_posts_id,
        // Post the last data timestamp to prevent pill duplication
        'last_timestamp': $('.gutter-infos[data-timestamp]').last().data('timestamp'),
        'page': toload
      };

      // Add optional year and month to request
      if($('#feed').data('year')) request['year'] = $('#feed').data('year');
      if($('#feed').data('month')) request['month'] = $('#feed').data('month');

      $.post('/' + asocial.binders.getCurrentGroup() + '/page', request, function(data){

        var lastPage = data.last_page,
            posts    = data.posts;

        // Check if there are pages to load
        if(typeof(posts) !== 'undefined' &&
           Object.keys(posts).length > 0) {

          // Buffer html.
          var postsHtml = [];

          for (var i = 0; i < posts.length; i++) {

            var post = posts[i];

            // Render HTML.
            var html = Fifty.render('feed-post', post);

            // Append page
            postsHtml.push(html);

          }

          // Append all the posts.
          for (var i = 0; i < postsHtml.length; i++) {
            var postHtml = postsHtml[i];
            $('#feed').data('pagesloaded', toload).append(postHtml);
          }

          if (lastPage) {
            // If all pages are loaded, disable infinite scrolling
            $(window).data('infinite-scroll-done', true);
            $('#load-more').hide();
          } else {
            $('#load-more').show();
          }

          // Decrypt new content
          asocial.crypto.decrypt();

          // Textarea autosizing
          $('textarea.autogrow').autogrow().removeClass('autogrow');


        }

      }).complete(function(){

        // Retrieve lock after AJAX request
        $(window).data('infinite-scroll-async', false);

      });
    }

  });

} }); // asocial.binders.add();