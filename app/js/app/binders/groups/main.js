Syme.Binders.add('groups', { main: function() {

  // Hide spinner
  NProgress.done();

  // Breadcrumbs
  Syme.Navbar.setBreadCrumb({
    brand_only: true,

    elements: [
      { title: 'Groups',
        href: 'users/' + Syme.CurrentSession.getUserId() + '/groups' }
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

    // Pass reference to self to subcontext.
    var $this = $(this);

    // Get the name for the group to be created.
    var name = $this.find('input[name="name"]').val();

    // If the name is empty, do nothing.
    if ( name.length == 0 ) return;

    // Prevent rapid creation of groups.
    if ($this.data('active') == true) return;

    // Mark pending group creation.
    $this.data('active', true);

    // Build the URL for the group creation API call.
    var createGroupUrl = Syme.Url.fromGroup();
    
    // Create a new empty group on the server.
    $.encryptedAjax(createGroupUrl, {
      
      type: 'POST',
      
      data: {  name: name },

      // Callback when group creation has succeeded.
      success: function (group) {

        // Get the group ID from the AJAX response.
        var groupId = group.id;

        // Create the keylist 
        Syme.Crypto.createKeylist(group.id, function (encryptedKeyfile) {

          // Get the user modal from the current session.
          var currentUser = Syme.CurrentSession.getUser();

          // Encrypt the keyfile and update it on the server.
          currentUser.updateKeyfile(encryptedKeyfile, function () {

            // Get the current user's ID from the current session.
            var userId = Syme.CurrentSession.getUserId();
            
            // Build the target route for redirection after group creation.
            var targetGroupRoute = Syme.Url.join('users', userId, 'groups', groupId);
            
            // Build the URL for the group creation acknowledgement API call.
            var updateGroupUrl = Syme.Url.fromBase(targetGroupRoute);
            
            // Acknowledge that group was successfully created in keyfile.
            $.encryptedAjax(updateGroupUrl, {

              type: 'PUT',

              data: { ack_create: true },

              // Callback when group creation acknowledgement succeeds.
              success: function () {

                Syme.Router.navigate(targetGroupRoute);
                $this.data('active', false);

              },

              // Callback when group creation acknowledgement fails.
              error: function (response) {
                
                Syme.Error.ajaxError(response, 'acknowledge', 'group');
                $this.data('active', false);

              }

            });

          });

        });
        
      },

      // Callback when group creation failed.
      error: function (response) {
        Syme.Error.ajaxError(response, 'create', 'group');
      }
      
    });

  });

  // Delete group
  $('#main').on('click', '.delete-group', function (e) {
    
    var $this = $(this);
    
    // Get the group id from the form.
    // This is a global variable on purpose. Gods have not
    // wanted this local variable to persist into the callback
    // scope. It is not wanted there. Please, future coders, do
    // not try to alter this sacred function. It is not meant to
    // be fixed. It doesn't want to be fixed. This is the sacred
    // realm of Javascript itself and it is its only master.
    //
    // Please rewrite the entire delete process instead of trying
    // to tame this nameless monster.
    //
    // Sincerely,
    // Chris and Louis
    Syme.globals.toDeleteGroupId = $this.data('group-id');
    
    e.preventDefault();
    
    var modal = Syme.Messages.modals.confirm.deleteGroup;
    
    var callback = function(value) {
      
      var groupId = Syme.globals.toDeleteGroupId;
      
      // If user did not enter the right confirmation
      // token (i.e. "delete"), do nothing and return.
      if (value != 'delete') return;
      
      // Get current user id from session.
      var userId = Syme.CurrentSession.getUserId();
      
      // Build API url to call to delete group.
      var deleteGroupUrl = Syme.Url.fromGroup(groupId);

      // Delete group on server, then do further cleanup.
      $.encryptedAjax(deleteGroupUrl, {
        
        // DELETE /users/userId/groups/groupId
        type: 'DELETE',

        // Callback when group deletion succeeded.
        success: function (response) {

          // Remove groups from current session.
          Syme.CurrentSession.groups.splice(
            Syme.CurrentSession.groups.indexOf(groupId), 1);

          // Get object representing the current user.
          var user = Syme.CurrentSession.getUser();

          // Delete the keylist from the user's keyfile.
          user.deleteKeylist(groupId, function () {
            Notifications.reset();
            Notifications.fetch();
            Syme.Router.navigate();
          });

        },
        
        // Callback when group deletion failed.
        error: function (response) {
          Syme.Error.ajaxError(response, 'delete', 'group');
        }

      });
      
      delete Syme.globals.toDeleteGroupId;

    };
    
    var prompt = new Prompt(modal.message, callback, modal);
    
    prompt.show();

  });

  // Leave group
  $('#main').on('click', '.leave-group', function (e) {

    var groupId = $(this).data('group-id');
    var userId = Syme.CurrentSession.getUserId();
    var modal = Syme.Messages.modals.confirm.leaveGroup;
    
    Confirm.show(modal.message,
      
      {
        
        closable: true,
        title: modal.title,
        submit: modal.submit,
        cancel: modal.cancel,

        onsubmit: function(){

          var baseUrl = Syme.Url.fromGroup(groupId);
          
          var deleteMembershipUrl = Syme.Url.join(
            baseUrl, 'memberships', userId);
          
          $.encryptedAjax(deleteMembershipUrl, {
            
            type: 'DELETE',

            // Callback when membership deletion succeeded.
            success: function () {
              
              var user = Syme.CurrentSession.getUser();
              
              user.deleteKeylist(groupId, function () {
                Syme.Router.reset();
              });
              
            },

            // Callback when membership deletion failed.
            error: function (response) {
              Syme.Error.ajaxError(response, 'leave', 'group');
            }

          });

        }
        
      }
    );
  });

  // Group pictures decryption
  $('.encrypted-background-image').trigger('decrypt');

} }); // Syme.Binders.add();