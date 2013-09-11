Syme.Binders.add('feed', { main: function(){

  // Fix (hide) awful chrome bug part 1
  $('#feed-panel-column').hide();

  // Initial decryption
  Syme.Crypto.batchDecrypt(function(){

    // Fix (hide) awful chrome bug part 2
    $('#feed-panel-column').show(0);

    var userId = Syme.CurrentSession.getUserId(),
        groupId = Syme.CurrentSession.getGroupId();

    var groupsUrl = 'users/' + userId + '/groups';
    var currentGroupUrl = groupsUrl + '/' + groupId;

    var currentGroupName = $('#feed').data('group-name');

    // Set navigation bar breadcrumb.
    Syme.Navbar.setBreadCrumb({

      brand_only: false,

      elements: [
        { title: 'Groups', href: groupsUrl },
        { title: currentGroupName, href: currentGroupUrl }
      ]

    });

  });

} }); // Syme.Binders.add();