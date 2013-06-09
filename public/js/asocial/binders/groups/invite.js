asocial.binders.add('groups', { invite: function() {
  
  $('#invite').submit(function (e) {

    e.preventDefault();
    
    // Get data from form.
    var email = $(this).find('input[name="email"]').val();
    
    asocial.auth.getPasswordLocal(function (password) {

      // 1A: !(P, p).
      var keys = asocial.crypto.generateRSA(true);

      // 1B: !sB
      var sB_salt = asocial.crypto.generateRandomHexSalt();
      var sB = asocial.crypto.calculateHash(password, sB_salt);

      // 1C: p -> {p}sB
      var P = asocial.crypto.encode(keys.public_key);
      var p = asocial.crypto.encode(keys.private_key);
      var p_sB = $.base64.encode(sjcl.encrypt(sB, p));
      
      // Build invitation.
      var invitation = $.param({
        email: email,
        P: P, p_sB: p_sB,
        sB_salt: sB_salt
      });

      // 1D: B -> R: (P, {p}sB)
      var group = asocial.binders.getCurrentGroup();
      
      $.post('/' + group + '/invite/send', invitation, function (data) {
        $('.invited-user').removeClass('hidden');
        $('.invite-user').addClass('hidden');
      });
      
    });

  });

  // Accept an invitation to join a group.
  $('.invite-link').on('click', function (e) {
    
    // Prevent form submission.
    e.preventDefault();

    // Get copy of self.
    var $that = $(this);

    asocial.auth.getPasswordLocal(function (password) {

      // Get invite token from accept link.
      var token = $that.data('invite-token');
      var P = $that.data('invite-p');

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
      var k_sA = sjcl.encrypt(sA, k);
      var PA_k = sjcl.encrypt(k, PA_txt);

      alert('Ask for question');
        
      // Build registration.
      var keys = $.param({
        token: token,
        user_id: asocial.state.user.id,
        k_P: $.base64.encode(k_P),
        k_sA: $.base64.encode(k_sA),
        PA_k: $.base64.encode(PA_k)
      });

      $.post('/invite/accept', keys, function (data) {
        $that.parent().html('The invite has been accepted');
      });

    });

  });
  
} }); // asocial.binders.add();