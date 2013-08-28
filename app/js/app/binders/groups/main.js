Binders.add('groups', { main: function() {

  // Hide spinner
  $('#spinner').hide();

  // Breadcrumbs
  Navbar.setBreadCrumb({
    brand_only: true,

    elements: [
      { title: 'Groups',
        href: 'users/' + CurrentSession.getUserId() + '/groups' }
    ]
  });

  var sortToColumns = function(arr, cols) {

    // Initialize results array with a level for each column
    var results = [];

    for(var i = 0; i < cols; i++){ results[i] = []; }

    // Set current column counter
    var currentCol = cols == 1 ? 0 : cols - 1;

    // Distribute every element
    _.each(arr, function(el) {

      // Add element to current column
      results[currentCol].push(el);

      // Increment or reset currentCol
      currentCol = currentCol + 1 >= cols ? 0 : currentCol + 1;

    });

    // Flatten and return
    return _.flatten(results);

  };

  // Masonry disposition helper
  var orderGroupCards = function(columns) {

    // Get <li>s
    var $ul = $('#groups ul'),
        $li = $ul.children("li").not(':first-child');

    // Store, remove and sort <li>s
    var sortedLi = $li.detach().sort(function(a, b) {

      // Get data-index of compared elements
      a = parseInt( $(a).attr('data-index'), 0 );
      b = parseInt( $(b).attr('data-index'), 0 );

      // Order numerically
      return a < b ? -1 : a > b ? 1 : 0;

    });

    // Append sorted <li>s
    $ul.append(sortToColumns(sortedLi, columns));

  };

  enquire
    // Small
    .register("screen and (max-width:767px)", {
      match : function() { orderGroupCards(1); }
    })
    // Medium
    .register("screen and (min-width:768px)", {
      match : function() { orderGroupCards(2); }
    });

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

  $('#create_group input[name="name"], #create_first_group input[name="name"]').keyup(function(){
    $(this).parent().find('a.btn')[
      $(this).val().length > 0 ? 'removeClass' : 'addClass'
    ]('disabled');
  });

  $('#main').on('submit', '#create_group, #create_first_group', function(e) {

    e.preventDefault();

    // Prevent rapid creation of groups.
    if ($(this).data('active') == true) return;

    // Mark pending group creation.
    $(this).data('active', true);

    // Pass reference to self to subcontext.
    var $this = $(this);

    var name = $(this).find('input[name="name"]').val();

    if ( name.length == 0 ) return;

    var group = {  name: name };

    $.encryptedAjax(SERVER_URL + '/groups', {
      type: 'POST',
      data: group,

      success: function (group) {

        var userId =  CurrentSession.getUserId(), groupId = group.id;

        var route = SERVER_URL + '/users/' + userId + '/groups/' + groupId;

        Crypto.createKeylist(group.id, function (encryptedKeyfile) {

          var currentUser = CurrentSession.getUser();

          currentUser.updateKeyfile(encryptedKeyfile, function () {

            Router.reload();

            $.encryptedAjax(route, {

              type: 'PUT',

              data: { ack_create: true },

              success: function () {

                $this.data('active', false);

              },

              error: function () {
                Alert.show(
                  'Could not acknowledge group creation.');

                $this.data('active', false);

              }

            });

          });

        });
      },

      error: function (error) {
        Alert.show(
          'Could not create group.');
      }
    });

  });

  // Delete group
  $('.delete-group').click(function (e) {

    e.preventDefault();

    var groupId = $(this).data('group-id'),
        message = 'Are you sure you want to delete this group ' +
                  'and all of its content? This is irreversible.' +
                  '<br>Type <b>delete</b> below to confirm.';

    var $this = $(this);
    
    Prompt.show(message, 
      
    function (value) {

      if (value != 'delete') return;

      $.encryptedAjax(SERVER_URL + '/groups/' + groupId,

        { type: 'DELETE',

        success: function (resp) {

          CurrentSession.groups.splice(CurrentSession.groups.indexOf(groupId), 1);

          var user = CurrentSession.getUser();

          user.deleteKeylist(groupId, function () {
            Notifications.reset();
            Notifications.fetch();
            Router.navigate();
          });

        },

        error: function (response) {

          if (response.status == 404) {
            Alert.show(
              'This group does not exist anymore.', {
              onhide: function () { Router.reload(); }
            });
          } else {
            Alert.show('Could not delete group', {
              onhide: function () { Router.reload(); }
            });
          }

        }

      });

    },

    {
      title: 'Delete group',
      submit: 'Ok',
      cancel: 'Cancel'
    });


  });

  // Leave group
  $('#main').on('click', '.leave-group', function (e) {

    var groupId = $(this).data('group-id');

    Confirm.show(
      'Do you really want to leave this group?',
      {
        closable: true,
        title: 'Leave group',
        submit: 'Leave',
        cancel: 'Cancel',

        onsubmit: function(){

          var route = SERVER_URL + '/users/' + CurrentSession.getUserId() +
          '/groups/' + groupId + '/memberships/' + CurrentSession.getUserId();

          $.encryptedAjax(route, { type: 'DELETE',

            success: function () {

              var user = CurrentSession.getUser();

              user.deleteKeylist(groupId, function () {
                Notifications.reset();
                Notifications.fetch();
                Router.reload();
              });

            },

            error: function () {
              Alert.show('Could not leave group.');
            }

          });

        }
      }
    );
  });

  // Group pictures decryption
  $('.encrypted-background-image').trigger('decrypt');

} }); // Binders.add();