asocial.binders.add('feed', { crypto: function(){

  /* Download methods */

  // Link every encrypted file on the page.
  $('.encrypted-file').on('click', function() {

    var link     = $(this),
        progress = link.parent().find('span');

    // Do nothing if file is decrypting
    if(link.data('decrypting')) return false;

    // Lock link
    link.html('Decrypting')
        .addClass('decrypting')
        .data('decrypting', true);

    var id       = link.data('attachment-id');
    var filename = link.data('attachment-filename');
    var key      = link.data('attachment-key');

    key = asocial_private_key().decrypt(key);

    asocial.crypto.getFile(id, key, function (url) {

      link.attr('href', url)
          .attr('download', filename)
          // Change link status
          .html('Download')
          .removeClass('decrypting')
          // Unbind decryption
          .off('click');

      link.closest('.attachment').find('a.image-download')
          .attr('href', url)
          .attr('download', filename);

      progress.remove();

      //if(confirm('Click OK to download.')) {
      //  saveAs(url, filename);
      //}

    });


  });

  // Shortcut for image attachment links
  $(document).on('click', 'a.image-download', function(){
    $(this).parent().find('.encrypted-file').click();
  });

} }); // asocial.binders.add();