asocial.binders.add('feed', { invite: function() {

    function sendKeys(PA, key, public_keys, answer, inviteId, id_A, k) {

      var group_id = CurrentSession.getGroupId();

      // Encrypt the public key list.
      var keylist = asocial.crypto.encryptKeyList(key, public_keys);

      // Store keylist for A encrypted using k.
      var PA_obj = asocial.crypto.ecc.buildPublicKey(PA);
      var PPA_k = sjcl.encrypt(k, JSON.stringify(public_keys));
      var a_PA = asocial.crypto.ecc.encrypt(PA_obj, answer);

      $.get('http://localhost:5000/' + group_id + '/invite/keys',
        $.param({invite_id: inviteId }), function (keyData) {

         // Generate integration data for server.
         var confirmation = $.param({
           group_id: group_id,
           invite_id: inviteId,
           PPA_k: $.base64.encode(PPA_k),
           a_PA: $.base64.encode(a_PA),
           invitee_id: id_A,
           keys: recryptKeys(PA_obj, keyData.keys)
         });

         confirmInvite(confirmation, PA, id_A);

      });

    }

    function confirmInvite(confirmation, PA, id_A) {

      $.post('http://localhost:5000/invite/confirm', confirmation, function (data) {

         if (data.status == 'ok') {

           var PA_msg = JSON.stringify(asocial.crypto.encryptMessage(JSON.stringify(PA)));

           var broadcast = $.param({
             public_key: PA_msg, invitee_id: id_A,
             group_id: CurrentSession.getGroupId()
           });

           broadcastKeys(broadcast);

        } else {

           asocial.helpers.showAlert('An error has occured with confirmation.');

        }

     });

    }

  $('.invite-confirm').click(function(e) {

    e.preventDefault();

    //sendKeys(PA, key, public_keys, answer, inviteId, id_A, k);
    
    var invitationId = $(this).data('invite-id');
    var inviteeId = $(this).data('invite-invitee_id');
    
    var accept = $(this).data('invite-accept');

    var user = CurrentSession.getUser();
    
    var keylistId = CurrentSession.getGroupId();
    
    user.confirmInviteRequest(invitationId, accept, function (confirmation) {
        user.transferKeysRequest(invitationId, inviteeId, function (transferedKeys) {
          alert('Confirmed!');
        });
    });
    
  });

} }); // asocial.binders.add();