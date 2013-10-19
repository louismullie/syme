Syme.Binders.add('feed', { main: function(){

  // Initial media decryption
  $('.user-avatar, .encrypted-image').trigger('decrypt');

  Syme.Decryptor.decryptPostsAndCommentsInContainer($('#feed'), function(){

    // Indicate to the feed scroller that the first page has
    // been loaded, thus initiating it.
    $('#feed').prop('scroller').loadedPages = 1;

  });

} }); // Syme.Binders.add();