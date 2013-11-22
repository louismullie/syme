Syme.Binders.add('feed', { main: function(){

  // Initial media decryption
  $('.user-avatar, .encrypted-image').trigger('decrypt');

  // Start decryption timer
  if (DEVELOPMENT)
    console.time('Initial decryption/formatting');

  var feed = $('#feed');

  Syme.Decryptor.decryptPostsAndCommentsInContainer(feed, function(){

    // End decryption timer
    if (DEVELOPMENT)
      console.timeEnd('Initial decryption/formatting');

    // Initiate feed scroller if we aren't in single post view
    if ( !feed.is('[data-single-post="true"]') )
      feed.prop('scroller', new Syme.FeedScroller);

  });

} }); // Syme.Binders.add();