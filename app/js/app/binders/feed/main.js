Syme.Binders.add('feed', { main: function(){

  // Initial media decryption
  $('.user-avatar, .encrypted-image').trigger('decrypt');

  console.time('Initial decryption/formatting');

  Syme.Decryptor.decryptPostsAndCommentsInContainer($('#feed'), function(){

    console.timeEnd('Initial decryption/formatting');

    // Indicate to the feed scroller that the first page has
    // been loaded, thus initiating it.
    if ($('#feed').prop('scroller'))
      $('#feed').prop('scroller').loadedPages = 1;

  });

} }); // Syme.Binders.add();