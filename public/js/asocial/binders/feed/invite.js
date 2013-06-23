asocial.binders.add('feed', { invite: function(){

  $('.invite-confirm').click(function(e) {

    e.preventDefault();

    var $that = $(this);

    function recrypt(publicKey, arr) {

      var result = [];

      $.each(arr, function (ind, elem) {
        var key = asocial.crypto.ecc.encrypt(publicKey,
          asocial.crypto.ecc.decrypt(asocial_private_key(), elem.key));

        result.push({id: elem.id, key: key});
      });

      return result;

    }

    function recryptPosts(publicKey, posts) {

      var result = [];

      $.each(posts, function (ind, post) {
        var key = asocial.crypto.ecc.encrypt(publicKey,
          asocial.crypto.ecc.decrypt(asocial_private_key(), post.key));

        result.push({id: post.id, key: key,
          comments: recrypt(publicKey, post.comments)});
      });

      return result;

    }

    function recryptKeys(rsa, keys) {

      return $.base64.encode (JSON.stringify({
        posts: recryptPosts(rsa, keys.posts),
        uploads: recrypt(rsa, keys.uploads)
      }) );

    }

    asocial.auth.getPasswordLocal(function (password) {

       // 3A.
       console.log("3A");

       var invite_id = $that.data('invite-id');
       var id_A = $that.data('invite-invitee_id');
       
       var encInviterPrivKey = $that.data('invite-enc_inviter_priv_key');
       var inviterPrivKeySalt = $that.data('invite-inviter_priv_key_salt');
       var inviteePublicKey = $that.data('invite-invitee_pub_key');
       
       var a_k = $.base64.decode($that.data('invite-a_k'));
       var PA_k = $.base64.decode($that.data('invite-pa_k'));
       
       var inviterPrivKeySymKey = asocial.crypto.calculateHash(password, inviterPrivKeySalt);
       var inviterPrivKeyJson = sjcl.decrypt(inviterPrivKeySymKey, $.base64.decode(encInviterPrivKey));
       var inviterPrivKey = asocial.crypto.ecc.buildPrivateKey(JSON.parse(inviterPrivKeyJson));
       
       var inviteePublicKey = asocial.crypto.ecc.buildPublicKey(JSON.parse($.base64.decode(inviteePublicKey)));
       
       var k = inviterPrivKey.dh(inviteePublicKey);
       
       var a = sjcl.decrypt(k, a_k);
       var PA = JSON.parse($.base64.decode(sjcl.decrypt(k, PA_k)));
       
       // Get serialized key list.
       var public_keys = asocial.crypto.serializeKeyList();

       // Add new user to key list.
       public_keys[id_A] = PA;

       // Generate a new keylist salt.
       var keylist_salt = asocial.crypto.generateRandomHexSalt();

       // Generate a hash from the keylist salt.
       var key = asocial.crypto.calculateHash(password, keylist_salt);

       var checkAnswer = function (a) {

        var proceed = prompt('User provided the wrong answer. ' +
            'The answer that was provided was: "' + a + '". ' +
            'Type "yes" to confirm invite anyway.');

         return proceed == 'yes';

       };

       // Verification
       console.log('Verification');
       
       // Generate answer key.
       var decryptAnswerKey = asocial.crypto.calculateHash(password, asocial.state.group.answer_salt);
       var answer = sjcl.decrypt(decryptAnswerKey, $.base64.decode(asocial.state.group.answer));

       if (a != answer && !checkAnswer(a))
         return;

       // Encrypt the public key list.
       var keylist = asocial.crypto.encryptKeyList(key, public_keys);

       // Store keylist for A encrypted using k.
       var PA_obj = asocial.crypto.ecc.buildPublicKey(PA);
       var PPA_k = sjcl.encrypt(k, JSON.stringify(public_keys));
       var a_PA = asocial.crypto.ecc.encrypt(PA_obj, answer);
       
      var group_id = asocial.binders.getCurrentGroup();
      
      $.get('/' + group_id + '/invite/keys',
        $.param({invite_id: invite_id }), function (keyData) {

         var group_id = asocial.binders.getCurrentGroup();

         // Generate integration data for server.
         var confirmation = $.param({
           group_id: group_id,
           invite_id: invite_id,
           PPA_k: $.base64.encode(PPA_k),
           a_PA: $.base64.encode(a_PA),
           invitee_id: id_A,
           keys: recryptKeys(PA_obj, keyData.keys),
           keylist: keylist,
           keylist_salt: keylist_salt
      });
      
      var group_id = asocial.binders.getCurrentGroup();
       $.post('/invite/confirm', confirmation, function (data) {

         if (data.status == 'ok') {

           var PA_msg = JSON.stringify(asocial.crypto.encryptMessage(JSON.stringify(PA)));

           var broadcast = $.param({
             public_key: PA_msg, invitee_id: id_A,
             group_id: asocial.binders.getCurrentGroup()
           });

           $.post('/invite/broadcast', broadcast, function (data) {

             if (data.status == 'ok') {
               //asocial.helpers.showAlert('Go back to groups panel and click on the group.');
               $that.append('Invite confirmed!');

             } else {
               asocial.helpers.showAlert('An error has occured with broadcasting.');
             }

           });

         } else {

           asocial.helpers.showAlert('An error has occured with confirmation.');

         }

       });

      });


    });

  });


} }); // asocial.binders.add();