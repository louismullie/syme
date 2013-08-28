Syme.Binders.add('feed', { main: function(){

  // Fix (hide) awful chrome bug part 1
  $('#feed-panel-column').hide();

  // Initial decryption
  Syme.Crypto.batchDecrypt(function(){

    // Fix (hide) awful chrome bug part 2
    $('#feed-panel-column').show(0);

    // Breadcrumbs
    Syme.Navbar.setBreadCrumb({
      brand_only: false,

      elements: [
        { title: 'Groups',
          href: 'users/' + Syme.CurrentSession.getUserId() + '/groups' },

        { title: $('#feed').data('group-name'),
          href: 'users/' + Syme.CurrentSession.getUserId() + '/groups/' + Syme.CurrentSession.getGroupId() }
      ]
    });

  });
  
} }); // Syme.Binders.add();