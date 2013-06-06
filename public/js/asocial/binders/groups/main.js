asocial.binders.add('groups', { main: function() {

  // Decrypt group avatars.
  asocial.crypto.decryptMedia();

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
      $.ajax('/groups/' + groupId, {
        type: 'DELETE',
        success: function (resp) {
          alert('Group was deleted.');
          asocial.binders.loadCurrentUrl();
        },
        error: function (resp) {
          alert('Error: could not delete group.');
        }
      });
    }

  });

  $('#create_group, #create_first_group').submit(function (e) {

    // Prevent form submission.
    e.preventDefault();

    // Get the group name from the form.
    var name = $(this).find('input[name="name"]').val();

    // Get the current user's ID from state.
    var userId = asocial.state.user.id;

    // Get the current user's public key.
    var publicKey = asocial_public_key();

    // Serialize public key to JSON format.
    var pKeyJson = asocial.crypto.serializePublicKey(publicKey);

    // Build a keylist with user's public key.
    var keylist =  {}; keylist[userId] = pKeyJson;
    var keylist = JSON.stringify(keylist);

    // Generate a random salt for keylist encryption.
    var salt = asocial.crypto.generateRandomHexSalt();

    // Retrieve the password from session storage.
    asocial.auth.getPasswordLocal(function (password) {

      // Derive a key from the user's password for encryption.
      var key = asocial.crypto.calculateHash(password, salt);

      // Encrypt the keylist using the key.
      var encryptedKeylist = sjcl.encrypt(key, keylist);

      // Base64 encode the encrypted keylist.
      var encryptedKeylist64 = $.base64.encode(encryptedKeylist);

      // Build parameters to pass to the group creation method.
      var params = $.param({
        name: name,
        keylist: encryptedKeylist64,
        keylist_salt: salt
      });

      // Create the group, passing the encrypted key list.
      $.post('/groups/create', params, function (group) {
        asocial.binders.goToUrl(group.name);
      });

    });

  });


} }); // asocial.binders.add();