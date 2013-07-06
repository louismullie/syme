asocial.binders.add('feed', { main: function(){

  // Initial decryption
  asocial.crypto.decryptAll(function(){

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

  });

} }); // asocial.binders.add();