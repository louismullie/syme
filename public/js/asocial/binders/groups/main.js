asocial.binders.add('groups', { main: function() {

  // Breadcrumbs
  asocial.helpers.navbarBreadcrumbs({
    brand_only: true,

    elements: [
      { title: 'Groups',
        href: 'users/' + CurrentSession.getUserId() + '/groups' }
    ]
  });

  // Decrypt group avatars.
  asocial.crypto.decryptMedia();

  // Timeago
  $('time.timeago').timeago();

  // Focus on first #create_first_group input[type="text"]
  $('#create_first_group').find('input[type="text"]').first().focus();

  // Group delete button toggling
  $("div.group-banner").on({
    mouseenter: function(){
      $(this).find('a.delete-group')
        .css({ display: 'block' })
        .transition({ opacity: 1}, 100);
    },
    mouseleave: function(){
      $(this).find('a.delete-group')
        .transition({ opacity: 0}, 100)
        .css({ display: 'none' });
    }
  });

  // Group creation panel toggling
  $("li.group-create a.group-card-title").on({
    click: function(e){
      $(this).parent().toggleClass('opened');
    }
  });

  $('#create_group input[name="name"], #create_first_group input[name="name"]').keyup(function(){
    $(this).parent().find('a.btn')[
      $(this).val().length > 0 ? 'removeClass' : 'addClass'
    ]('disabled');
  });

  $('#main').on('submit', '#create_group, #create_first_group', function(e) {

    e.preventDefault();
    
    var name = $(this).find('input[name="name"]').val();
    
    if ( name.length == 0 ) return;

    var group = {  name: name };
    
    $.ajax(SERVER_URL + '/groups', 
    
      {
        
        type: 'POST', 
        
        data: group,
        
        success: function (group) {

          var route = SERVER_URL + '/users/' +
            CurrentSession.getUserId() + '/groups';
      
          Crypto.createKeylist(group.id, function (encryptedKeyfile) {
            
            CurrentSession.getUser().updateKeyfile(
              encryptedKeyfile,
              function () {
                Router.reload();
                asocial.socket.listen();
              }
            );
            
          });
        },
        
        error: function (error) {
          alert('Error on group creation!');
        }
    
    });

  });

  $('.delete-group').click(function (e) {

    e.preventDefault();

    var groupId = $(this).data('group-id');

    var message = 'Are you sure? Type "yes" to confirm.';

    if (prompt(message) == 'yes') {
      
      $.ajax(SERVER_URL + '/groups/' + groupId, {
        
        type: 'DELETE',
        
        success: function (resp) {
          
          var user = CurrentSession.getUser();
          
          user.deleteKeylist(groupId, function () {
             Router.reload();
          });
          
        },
        
        error: function (resp) {
          asocial.helpers.showAlert(
            'Could not delete group',
          { onhide: location.reload });
        }
      });
    }

  });

} }); // asocial.binders.add();