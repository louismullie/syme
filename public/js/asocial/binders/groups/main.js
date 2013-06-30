asocial.binders.add('groups', { main: function() {

  // Decrypt group avatars.
  asocial.crypto.decryptMedia();

  // Timeago
  $('time.timeago').timeago();

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

  $('.delete-group').click(function (e) {

    e.preventDefault();

    var groupId = $(this).data('group-id');

    var message = 'Are you sure? Type "yes" to confirm.';

    if (prompt(message) == 'yes') {
      $.ajax('http://localhost:5000/groups/' + groupId, {
        type: 'DELETE',
        success: function (resp) {
          Router.reload();
        },
        error: function (resp) {
          asocial.helpers.showAlert('Registration error.', { onhide: location.reload });
        }
      });
    }

  });

  $('#main').on('submit', '#create_group, #create_first_group', function(e) {

    e.preventDefault();
    
    var name = $(this).find('input[name="name"]').val();
    
    var group = {  name: name };
    
    $.ajax('http://localhost:5000/groups', 
    
      {
        
        type: 'POST', 
        
        data: group,
        
        success: function (group) {

          var route = 'http://localhost:5000/users/' + CurrentSession.getUserId() + '/groups';
      
          Crypto.createKeylist(
            group.id, function (encryptedKeyfile) {
              alert(encryptedKeyfile);
          });
      
          Router.reload();
      
        },
        
        error: function (error) {
          alert('Error on group creation!');
        }
    
    });

  });

} }); // asocial.binders.add();