asocial.binders.add('feed', { main: function(){

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

  // Initial decryption
  var selectors = $([

    // Feed elements
    '.encrypted',
    '.encrypted-image',
    '.encrypted-audio',
    '.encrypted-video',

    // User avatars
    '.user-avatar'

  ].join(','));

  asocial.crypto.decryptCollection(selectors, function(collection, elapsedTime){
    alert('Done decrypting collection of ' + collection.length + ' ' +
          'items in ' + elapsedTime/1000 + 's');
  });

} }); // asocial.binders.add();