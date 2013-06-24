asocial.binders.add('groups', { invite: function() {

  // Accept an invitation to join a group.
  $('.invite-link[data-invite-state="1"]').on('click', function (e) {

    // Prevent form submission.
    e.preventDefault();

    // Get copy of self.
    var $that = $(this);

    asocial.auth.getPasswordLocal(function (password) {

      // Get invite token from accept link.
      var token = $that.data('invite-token');
      var inviterPubKey = $that.data('invite-inviter_pub_key');

      var inviterPublicKey = asocial.crypto.ecc.buildPublicKey(
        JSON.parse($.base64.decode(inviterPubKey)));

      var inviteeKeys = asocial.crypto.ecc.generateKeys();
      var inviteePrivKey = asocial.crypto.ecc.serializePrivateKey(inviteeKeys.sec);
      var inviteePubKey = asocial.crypto.ecc.serializePublicKey(inviteeKeys.pub);

      var inviteePrivKeySalt = asocial.crypto.generateRandomHexSalt();
      var inviteePrivKeySymKey = asocial.crypto.calculateHash(password, inviteePrivKeySalt);

      var encInviteePrivKey = sjcl.encrypt(inviteePrivKeySymKey,
        $.base64.encode(JSON.stringify(inviteePrivKey)));

      var inviteAnswer = prompt($that.data('invite-question'));

      var k = inviteeKeys.sec.dh(inviterPublicKey);

      var PA = asocial.crypto.ecc.serializePublicKey(asocial_public_key());
      var PA_k = sjcl.encrypt(k, $.base64.encode(JSON.stringify(PA)));

      var sA = asocial.crypto.calculateHash(password, asocial.state.user.keypair_salt);
      var k_sA = $.base64.encode(sjcl.encrypt(sA, JSON.stringify(k)));

      var a_k = sjcl.encrypt(k, inviteAnswer);

      // Build registration.
      var keys = $.param({
        token: token, user_id: asocial.state.user.id,
        invitee_pub_key: $.base64.encode(JSON.stringify(inviteePubKey)),
        enc_invitee_priv_key: encInviteePrivKey,
        invitee_priv_key_salt: inviteePrivKeySalt,
        PA_k: $.base64.encode(PA_k),
        a_k: $.base64.encode(a_k),
        k_sA: k_sA
      });

      $.post('http://localhost:5000/invite/accept', keys, function (data) {
        // Refresh page
        Router.reload();
      });

    });

  });

} }); // asocial.binders.add();