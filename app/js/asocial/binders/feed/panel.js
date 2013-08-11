asocial.binders.add('feed', { panel: function(){

  // Group photo edit button action
  $('#group-photo-edit').click(function(e){
    if($(this).data('active')) return;
    $('#group-photo-file').trigger('click');
  });

  // Group photo upload
  $('#main').on('change', '#group-photo-file', function(){

    var trigger = $('#group-photo-edit');

    // Get filename
    var filename = asocial.helpers.getFilename($(this).val());

    // Return if filename is blank
    if (filename == '') return;

    trigger
      // Lock trigger
      .data('active', true)
      // Show spinner
      .addClass('active');

    var removeActive = function() {
      trigger
        // Unlock trigger
        .data('active', false)
        // Remove spinner
        .removeClass('active');
    };

    // Thumbnail and upload avatar
    var started = asocial.uploader.selectGroupAvatar(
      // Filename
      $(this)[0].files[0],

      // Thumnail callback
      function(url) {
        // Replace thumbnail in DOM
        $('#group-photo-edit img').attr('src', url);
      },

      // Success callback
      removeActive
    );

    if (!started) removeActive();

  });

  // Delete user button toggling
  $('#main').on({
    mouseenter: function(){
      $(this).find('a.user-delete').first()
        .css({ display: 'block' })
        .transition({ opacity: 1}, 100);
    },
    mouseleave: function(){
      $(this).find('a.user-delete').first()
        .transition({ opacity: 0}, 100)
        .css({ display: 'none' });
    }
  }, 'ul#userlist > li');

  // Delete user
  $('#main').on('click', '.user-delete', function (e) {

    var userId = $(this).parent().attr('id');

    asocial.helpers.showConfirm(
      'Do you really want to delete this user from the group?',
      {
        closable: true,
        title: 'Delete user',
        submit: 'Delete',
        cancel: 'Cancel',

        onsubmit: function(){

          var route = SERVER_URL + '/users/' + CurrentSession.getUserId() +
          '/groups/' + CurrentSession.getGroupId() + '/memberships/' + userId;

          $.encryptedAjax(route, { type: 'DELETE',

            success: function () {
              Notifications.reset();
              Notifications.fetch();
              Router.reload();
            },

            error: function (response) {
              if (response.status == 404) {
                asocial.helpers.showAlert(
                  'This user has already left the group.');
              } else {
                alert('Could not delete user.');
              }
            }

          });

        }
      }
    );
  });
  
  //$('#main').on('click', '.user', function (e) {
  //  
  //  var userId = $(this).closest('li').attr('id');
  //  
  //  $.ajax(SERVER_URL + '/hangouts', { 
  //    
  //    type: 'POST',
  //    data: { recipient_id: userId },
  //    
  //    success: function (data) {
  //      
  //      var hangoutId = data.id;
  //      
  //    },
  //    
  //    error: function (response) {
  //      
  //      alert('Could not create hangout.');
  //      
  //    }
  //    
  //  });
  //  
  //});
  
} }); // asocial.binders.add();