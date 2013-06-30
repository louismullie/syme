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

    // Prevent form submission.
    e.preventDefault();
    
    /* End new crypto */

    // Get the group name from the form.
    var name = $(this).find('input[name="name"]').val();

    // Create the group, passing the encrypted key list.
    $.post('http://localhost:5000/groups', groupParams, function (group) {

      var route = 'http://localhost:5000/users/' +
        CurrentSession.getUserId() + '/groups';
      
      Crypto.generateKeyfile(group.id);
        
      Router.reload();
      
    });

  });

} }); // asocial.binders.add();