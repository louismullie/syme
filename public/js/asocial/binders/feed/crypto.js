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

    key = asocial.crypto.ecc.decrypt(asocial_private_key(), key);

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
  $('#main').on('click', 'a.image-download', function() {
    
    var img      = $(this).find('.attached-image');
    var id       = img.data('attachment-id');
    var filename = img.data('attachment-filename');
    var key      = img.data('attachment-key');
    
    key = asocial.crypto.ecc.decrypt(asocial_private_key(), key);
    
    asocial.crypto.getFile(id, key, function (url) {

      asocial.helpers.showLigthBox(url);
      
    });

  });

} }); // asocial.binders.add();