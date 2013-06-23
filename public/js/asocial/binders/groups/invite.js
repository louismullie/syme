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
      var P = $that.data('invite-p');
      
      //var inviteeKey = sjcl.ecc.elGamal.generateKeys(384, 10); 
      //var inviteePublic = inviteeKey.pub;

      var a = prompt($that.data('invite-question'));

      // 2A: generate k.
      console.log("2A");
      var k = asocial.crypto.generateRandomKey();

      // 2B.1 retrieve P.
      console.log("2B.1");
      var P_txt = JSON.parse($.base64.decode(P));
      var P = asocial.crypto.buildPublicKey(P_txt);

      // 2B.2 retrieve sA.
      console.log("2B.2");

      var sA = asocial.crypto.calculateHash(
        password, asocial.state.user.keypair_salt);

      // 2B.3 retrieve PA.
      console.log("2B.3")
      var PA = asocial_public_key();
      var PA_txt = JSON.stringify(
        asocial.crypto.serializePublicKey(PA));

      // 2C: A -> R: {k}P, {k}sA, {PA}k
      var k_P = P.encrypt(k);
      var a_P = P.encrypt(a);

      var k_sA = sjcl.encrypt(sA, k);
      var PA_k = sjcl.encrypt(k, PA_txt);

      // Build registration.
      var keys = $.param({
        token: token,
        user_id: asocial.state.user.id,
        k_P: $.base64.encode(k_P),
        k_sA: $.base64.encode(k_sA),
        PA_k: $.base64.encode(PA_k),
        a_P: $.base64.encode(a_P),
        // encryptedInviteeKey: encryptedInviteeKey,
        // inviteePublic: inviteePublic
      });

      $.post('/invite/accept', keys, function (data) {
        // Refresh page
        asocial.binders.goToUrl('/');
      });

    });

  });

} }); // asocial.binders.add();