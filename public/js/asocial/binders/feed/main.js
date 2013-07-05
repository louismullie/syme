asocial.binders.add('feed', { main: function(){

  // Will be run once all original content is decrypted
  var batchDecryptCb = function(elapsedTime) {

    console.log(
      'Done decrypting collection of ' + this.length +
      ' items in ' + elapsedTime/1000 + 's'
    );

    // Show decrypted posts
    $('.post').removeClass('hidden');

    // Hide spinner
    $('#spinner').hide();

    // Breadcrumbs
    asocial.helpers.navbarBreadcrumbs({
      brand_only: false,

      elements: [
        { title: 'Groups',
          href: 'users/' + CurrentSession.getUserId() + '/groups' },

        { title: $('#feed').data('group-name'),
          href: Backbone.history.fragment }
      ]
    });

  };

  // Initial decryption
  $([

    // Feed elements
    '.encrypted',
    '.encrypted-image',
    '.encrypted-audio',
    '.encrypted-video',

    // User avatars
    '.user-avatar'

  ].join(',')).batchDecrypt(batchDecryptCb);

} }); // asocial.binders.add();