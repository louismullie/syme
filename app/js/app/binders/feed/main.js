Syme.Binders.add('feed', { main: function(){

  // Initial media decryption
  $('.user-avatar, .encrypted-image').trigger('decrypt');

  console.time('Initial decryption/formatting');

  Syme.Decryptor.decryptPostsAndCommentsInContainer($('#feed'), function(){

    console.timeEnd('Initial decryption/formatting');

    $('#feed').prop('scroller', new Syme.FeedScroller);

  });

} }); // Syme.Binders.add();