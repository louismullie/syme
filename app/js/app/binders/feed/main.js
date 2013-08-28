Binders.add('feed', { main: function(){

  // Fix (hide) awful chrome bug part 1
  $('#feed-panel-column').hide();

  // Initial decryption
  asocial.crypto.batchDecrypt(function(){

    // Fix (hide) awful chrome bug part 2
    $('#feed-panel-column').show(0);

    // Breadcrumbs
    Navbar.setBreadCrumb({
      brand_only: false,

      elements: [
        { title: 'Groups',
          href: 'users/' + CurrentSession.getUserId() + '/groups' },

        { title: $('#feed').data('group-name'),
          href: 'users/' + CurrentSession.getUserId() + '/groups/' + CurrentSession.getGroupId() }
      ]
    });

  });
  
} }); // Binders.add();