guard('invite', {

  integrate: function (callback) {

    var _this = this;

    asocial.auth.getPasswordLocal(function (password) {

      var PPA_k = asocial.state.invite.PPA_k;
      var k_sA = asocial.state.invite.k_sA;

      var sA = asocial.crypto.calculateHash(
       password, asocial.state.user.keypair_salt);

      var PPA_k = $.base64.decode(PPA_k);
      var k_sA = $.base64.decode(k_sA);

      var k = JSON.parse(sjcl.decrypt(sA, k_sA));
      var PPA = JSON.parse(sjcl.decrypt(k, PPA_k));

      // Retrieve security answer from inviter.
      var securityAnswer =asocial.crypto.ecc.decrypt(asocial_private_key(), 
        $.base64.decode(asocial.state.invite.a_PA));

      // Generate a random key salt.
      var answerSalt = asocial.crypto.generateRandomHexSalt();
      var answerKey = asocial.crypto.calculateHash(password, answerSalt);

      // Encrypt the security key with the current user's secret key.
      var encryptedAnswer = sjcl.encrypt(answerKey, securityAnswer);
      // Encode the security key with base 64.
      var encodedAnswer = $.base64.encode(encryptedAnswer);

      // Set the state now in case the user invites someone.
      asocial.state.group.answer = securityAnswer;
      asocial.state.group.answer_salt = answerSalt;

      var PA = asocial.crypto.ecc.serializePublicKey(asocial_public_key());

      PPA[asocial.state.user.id] = PA;

      var keylist_salt = asocial.crypto.generateRandomHexSalt();
      var new_sA = asocial.crypto.calculateHash(password, keylist_salt);
      var keylist = asocial.crypto.encryptKeyList(new_sA, PPA);

      var integration = $.param({
        keylist: keylist,
        keylist_salt: keylist_salt,
        answer: encodedAnswer,
        answer_salt: answerSalt,
        invite_id: asocial.state.invite.id,
        group_id: asocial.state.group.id
      });

      $.post('http://localhost:5000/invite/integrate', integration, function (data) {

        if (data.status == 'ok') {

          var ack = $.param({
            type: 'integrate',
            group_id: asocial.state.group.id,
            invite_id: asocial.state.invite.id
          });

          $.post('http://localhost:5000/invite/acknowledge', ack, function () {
            // asocial.helpers.showAlert('Integrated the group successfully!');
            _this.refreshKeys(callback);
          });

        } else {
          asocial.helpers.showAlert('An error has occured with integration.');
        }

     });

    });

  },

  update: function (callback) {

    var _this = this;

    var new_keys = JSON.parse($.base64.decode(asocial.state.invite.new_keys));

    asocial.auth.getPasswordLocal(function (password) {

      var sB_salt = asocial.crypto.generateRandomHexSalt();
      var sB = asocial.crypto.calculateHash(password, sB_salt);

      var keylist = asocial_keylist();

      var public_keys = {};

      $.each(keylist, function (id, key) {
        public_keys[id] = asocial.crypto.ecc.serializePublicKey(key);
      });

      var new_keys = JSON.parse($.base64.decode(asocial.state.invite.new_keys));

      $.each(new_keys, function (id, msg) {
        var msg = JSON.parse(msg);
        var content = msg.content;
        var key = msg.keys[asocial.state.user.id];
        var public_key = asocial.crypto.decryptMessage(content, key);
        public_keys[id] = JSON.parse(public_key);
      });

      var keylist = asocial.crypto.encryptKeyList(sB, public_keys);

      var group_id = asocial.state.group.id;

      var update = $.param({
        keylist: keylist,
        keylist_salt: sB_salt,
        group_id: group_id
      });

      $.post('http://localhost:5000/invite/update', update, function (data) {

        if (data.status == 'ok') {

          var ack = $.param({
            type: 'update',
            group_id: group_id,
            new_keys: Object.keys(new_keys)
          });

          $.post('http://localhost:5000/invite/acknowledge', ack, function () {
            // asocial.helpers.showAlert('Added a new group member to your keys!');
            _this.refreshKeys(callback);
          });

        } else {
          asocial.helpers.showAlert('An error has occured with key update.');
        }

      });

    });

  },

  refreshKeys: function (callback) {
    var callback = callback || function () {};
    asocial.state.getState('group', function () {
      asocial.auth.getPasswordLocal(asocial.crypto.decryptKeylist);
      callback();
    }, { group_id: asocial.state.group.id, force: true })
  },

  inviteSubmit: function(email, callback) {

    asocial.auth.getPasswordLocal(function (password) {
    
      var keys = asocial.crypto.ecc.generateKeys();
      
      var invitePubKey = JSON.stringify(asocial.crypto.ecc.serializePublicKey(keys.pub));
      var invitePrivKey = JSON.stringify(asocial.crypto.ecc.serializePrivateKey(keys.sec));
      
      var invitePrivKeySalt = asocial.crypto.generateRandomHexSalt();
      var invitePrivKeySymKey = asocial.crypto.calculateHash(password, invitePrivKeySalt);
    
      var encInviterPrivKey = sjcl.encrypt(invitePrivKeySymKey, invitePrivKey);
      
      var invitation = $.param({
        email: email,
        inviter_pub_key: $.base64.encode(invitePubKey),
        enc_inviter_priv_key: $.base64.encode(encInviterPrivKey),
        inviter_priv_key_salt: invitePrivKeySalt
      });

      var group = asocial.state.group.id;

      $.post('http://localhost:5000/' + group + '/invite/send', invitation, function (data) {
        callback(data);
      });

    });

  }

});