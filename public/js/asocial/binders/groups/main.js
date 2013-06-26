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

    // Get the group name from the form.
    var name = $(this).find('input[name="name"]').val();

    // Get the current user's ID from state.
    var userId = asocial.state.user.id;

    // Get the current user's public key.
    var publicKey = asocial_public_key();

    // Serialize public key to JSON format.
    var pKeyJson = asocial.crypto.ecc.serializePublicKey(publicKey);

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

      // Get a security questions and answer for the user
      var question = prompt('Please enter a security question:');
      var securityAnswer = prompt('Please enter the answer to the question:');
      // CHRIS - modify this code to take input from the form.

      // Verify question and answer are present.
      if (!question || !securityAnswer) {
        alert('You must enter a question and an answer.');
        return;
      }

      // Generate a random key salt.
      var answerSalt = asocial.crypto.generateRandomHexSalt();
      var answerKey = asocial.crypto.calculateHash(password, answerSalt);

      // Encrypt the security key with the current user's secret key.
      var encryptedAnswer = sjcl.encrypt(answerKey, securityAnswer);

      // Encode the security key with base 64.
      var encodedAnswer = $.base64.encode(encryptedAnswer);

      // Build the params to send to the server.
      var groupParams = $.param({

        name: name,
        keylist: encryptedKeylist64,
        keylist_salt: salt,

        question: question,
        answer: encodedAnswer,
        answer_salt: answerSalt

      });

      // Create the group, passing the encrypted key list.
      $.post('http://localhost:5000/groups', groupParams, function (group) {
    
        console.log('/users/' + asocial.state.user.id + '/groups')
        var route = '/users/' + asocial.state.user.id + '/groups';

        Router.reload();
      });

    });

  });
  
  $('time.timeago').timeago();

} }); // asocial.binders.add();