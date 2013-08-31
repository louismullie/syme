Syme.Binders.add('feed', { feed: function(){

  // Form feed focus color
  $('#textarea-holder textarea').on({
    focusin: function(){
      $(this).parent().addClass('focused');
    },
    focusout: function(){
      $(this).parent().removeClass('focused');
    }
  });

  // Unread button
  $('#main').on('click', '#newcontent a', function(e){

    if(Syme.globals.updatedComments > 0){
      // If there are new comments, reset feed
      // to reorder the bump sorting.
      Syme.Router.reload();
    } else {
      // If there are only new post, append them.
      Syme.Helpers.showUnreadPosts();
    }

  });

  // Infinite scroller
  $('#feed').data('pagesloaded', 1);

  $(window).data('infinite-scroll-done', false)
           .data('infinite-scroll-async', false)
           .data('infinite-scroll-manual', false);

  $(window).on('scroll', function(){

    if( $(window).data('infinite-scroll-done'  )  ||
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
        //'last_timestamp': $('.gutter-infos[data-timestamp]').last().data('timestamp'),
        'page': toload
      };

      // Add optional year and month to request
      if($('#feed').data('year')) request['year'] = $('#feed').data('year');
      if($('#feed').data('month')) request['month'] = $('#feed').data('month');

      $('#load-more').show();

      var groupId = Syme.CurrentSession.getGroupId();
      var url = SERVER_URL + '/' + groupId + '/page';
      
      $.post(url, request, function(data){

        var lastPage = data.last_page,
            posts    = data.posts;

        // Check if there are pages to load
        if(Object.keys(data).length > 0) {

          // Buffer html.
          var postsHtml = [];

          for (var i = 0; i < posts.length; i++) {

            var post = posts[i];

            // Render HTML.
            var html = Syme.Template.render('feed-post', post);

            // Append page
            $('#feed').data('pagesloaded', toload).append(html);

          }

          if (lastPage) {

            // If all pages are loaded, disable infinite scrolling
            $(window).data('infinite-scroll-done', true);

            // Please Chris, look at this
            $('#feed .post').last().css({ 'border-bottom': 'none' });

            // Decrypt new content
            Syme.Crypto.batchDecrypt(function () {
              $('#load-more').hide();
            });

          } else {

            // Please Chris, look at this
            $('#feed .post').last().css({ 'border-bottom': '1px solid #ddd' });


            // Decrypt new content
            Syme.Crypto.batchDecrypt(function () {
              $('#load-more').show();
            });

          }

        } else {

          // No more pages to load
          $(window).data('infinite-scroll-done', true);

          $('#load-more').hide();

        }

      }).complete(function(){

        // Retrieve lock after AJAX request
        $(window).data('infinite-scroll-async', false);

      });
    }

  });

  // Load more button
  $('#main').on('click', '#load-more a', function(e){
    e.preventDefault();

    // Hide load-more container
    $(this).parent().fadeOut('fast');

    // Unlock infinite scrolling and load page
    $(window)
      .data('infinite-scroll-manual', false)
      .trigger('scroll');

  });

  // Prevent leaving if there's unsaved content
  $(window).bind("beforeunload", function(e) {

    var unsavedContent = _.any($('textarea'),
      function (textarea) { return textarea.value != ''; });

    return unsavedContent ? Syme.Messages.error.unsavedContent : null;

  });

} }); // Syme.Binders.add();