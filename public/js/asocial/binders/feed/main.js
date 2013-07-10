asocial.binders.add('feed', { main: function(){

  $('#feed-panel-column').hide();

  // Initial decryption
  asocial.crypto.batchDecrypt(function(){

    $('#feed-panel-column').show(0);

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