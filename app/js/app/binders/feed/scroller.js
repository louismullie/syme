Syme.Binders.add('feed', { scroller: function(){

  // Infinite scroller
  $('#feed').data('pagesloaded', 1);

  $(window).data('infinite-scroll-done', false)
           .data('infinite-scroll-async', false)
           .data('infinite-scroll-manual', false);

  $(window).on('scroll infinitescroll.trigger', function(){

    if( !$(window).data('infinite-scroll-started') ||
        $(window).data('infinite-scroll-done') ||
        $(window).data('infinite-scroll-async') ||
        $(window).data('infinite-scroll-manual') ) return;

    if($(window).scrollTop() >= $(document).height() - $(window).height() - 50){

      // Lock semaphore before AJAX request
      $(window).data('infinite-scroll-async', true);

      // Creates an array containing all showed posts
      var showed_posts_id = Array();

      $.each($('.post'), function(index, value){
        showed_posts_id.push($(this).attr('id'));
      });

      // Prevent triggering scroller when no posts shown
      if (showed_posts_id.length == 0) return;

      // Increment feed's state
      var toload = $('#feed').data('pagesloaded') + 1;

      // Build post request
      var request = {
        // Post a list of already showed posts to prevent duplication
        'ignore': showed_posts_id,
        'page': toload
      };

      // Add optional year and month to request
      if($('#feed').data('year')) request['year'] = $('#feed').data('year');
      if($('#feed').data('month')) request['month'] = $('#feed').data('month');

      // Spinner and loadmore
      NProgress.showSpinner();
      $('#load-more').show();

      var groupId = Syme.CurrentSession.getGroupId();
      var url = SERVER_URL + '/' + groupId + '/page';

      $.post(url, request, function(data){

        NProgress.hideSpinner();

        // Deactivate and return if there are no
        // more posts to load
        if ( _.isEmpty(data) ) {

          $(window).data('infinite-scroll-done', true);
          $('#load-more').hide();

          return;

        }

        // Deactivate if this is the last page
        $(window).data( 'infinite-scroll-done', data.last_page ? true : false );

        // Generate templates for each post
        var html = $();

        _.each(data.posts, function(post){

          // Add generated post to the $html jQuery collection
          html = html.add(
            $( Syme.Template.render('feed-post', post) )
          );

        });

        // Update counter
        $('#feed').data('pagesloaded', toload);

        // Append generated templates
        $('#feed').append( html );

        // Please Chris, look at this
        $('#feed .post').last().css({ 'border-bottom': 'none' });

        // Decrypt new content
        Syme.Decryptor.decryptPostsAndCommentsInContainer($('#feed'), function(){

          // Show or hide load-more
          $('#load-more').hide();

        });

      }).complete(function(){

        // Release lock after AJAX request
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
      .trigger('infinitescroll.trigger');

  });

} }); // Syme.Binders.add();
