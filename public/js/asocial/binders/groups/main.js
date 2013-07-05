asocial.binders.add('groups', { main: function() {

  // Hide spinner
  $('#spinner').hide();

  // Breadcrumbs
  asocial.helpers.navbarBreadcrumbs({
    brand_only: true,

    elements: [
      { title: 'Groups',
        href: 'users/' + CurrentSession.getUserId() + '/groups' }
    ]
  });

  // Group pictures decryption
  $('.encrypted-background-image').trigger('decrypt');

  // Timeago
  $('time.timeago').timeago();

  // Focus on first #create_first_group input[type="text"]
  $('#create_first_group').find('input[type="text"]').first().focus();

  // Group delete button toggling
  $("div.group-banner").on({
    mouseenter: function(){
      $(this).find('a.delete-group, a.leave-group')
        .css({ display: 'block' })
        .transition({ opacity: 1}, 100);
    },
    mouseleave: function(){
      $(this).find('a.delete-group, a.leave-group')
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

    $.ajax(SERVER_URL + '/groups', {
      type: 'POST',
      data: group,

      success: function (group) {

        var route = SERVER_URL + '/users/' +
          CurrentSession.getUserId() + '/groups';

        var ack = SERVER_URL + '/users/' +
          CurrentSession.getUserId() + '/groups/' + group.id;

        Crypto.createKeylist(group.id, function (encryptedKeyfile) {

          CurrentSession.getUser().updateKeyfile(
            encryptedKeyfile, function () {

              Router.reload();

              $.ajax(ack, {
                type: 'PUT',
                data: { ack_create: true }
              });

          });

        });
      },

      error: function (error) {
        alert('Error on group creation!');
      }
    });

  });

  // Delete group
  $('.delete-group').click(function (e) {

    e.preventDefault();

    var groupId = $(this).data('group-id'),
        message = 'Are you sure? Type "yes" to confirm.';

    if (prompt(message) == 'yes') {

      $.ajax(SERVER_URL + '/groups/' + groupId, {
        type: 'DELETE',

        success: function (resp) {

          var user = CurrentSession.getUser();

          user.deleteKeylist(groupId, Router.reload);

        },

        error: function (resp) {
          asocial.helpers.showAlert('Could not delete group', {
            onhide: location.reload
          });
        }
      });
    }

  });

  // Leave group
  $('#main').on('click', '.leave-group', function (e) {

    var groupId = $(this).data('group-id');

    asocial.helpers.showConfirm(
      'Do you really want to leave this group?',
      {
        closable: true,
        title: 'Leave group',
        submit: 'Leave',
        cancel: 'Cancel',

        onsubmit: function(){

          var route = SERVER_URL + '/users/' + CurrentSession.getUserId() +
          '/groups/' + groupId + '/memberships/' + CurrentSession.getUserId();

          $.ajax(route, { type: 'DELETE',

            success: function () {
              Router.reload();
            },

            error: function () {
              asocial.helpers.showAlert('Could not leave group.');
            }

          });

        }
      }
    );
  });

} }); // asocial.binders.add();