guard('invite', {

  integrate: function () {
    
    var _this = this;
    
    asocial.auth.getPasswordLocal(function (password) {

      var PPA_k = asocial.state.invite.PPA_k;
      var k_sA = asocial.state.invite.k_sA;

      var sA = asocial.crypto.calculateHash(
       password, asocial.state.user.keypair_salt);

      var PPA_k = $.base64.decode(PPA_k);
      var k_sA = $.base64.decode(k_sA);

      var k = sjcl.decrypt(sA, k_sA);
      var PPA = JSON.parse(sjcl.decrypt(k, PPA_k));

      var PA = asocial.crypto.serializePublicKey(asocial_public_key());

      PPA[asocial.state.user.id] = PA;

      var keylist_salt = asocial.crypto.generateRandomHexSalt();
      var new_sA = asocial.crypto.calculateHash(password, keylist_salt);
      var keylist = asocial.crypto.encryptKeyList(new_sA, PPA);

      var integration = $.param({
        keylist: keylist,
        keylist_salt: keylist_salt,
        invite_id: asocial.state.invite.id,
        group_id: asocial.binders.getCurrentGroup()
      });
      
      $.post('/invite/integrate', integration, function (data) {

        if (data.status == 'ok') {
          
          var ack = $.param({
            type: 'integrate',
            group_id: asocial.binders.getCurrentGroup(),
            invite_id: asocial.state.invite.id
          });
        
          $.post('/invite/acknowledge', ack, function () {
            // alert('Integrated the group successfully!');
            _this.refreshKeys();
          });
          
        } else {
          alert('An error has occured with integration.');
        }
          
     });
     
    });
    
  }, 
  
  update: function () {
    
    var _this = this;
    
    var new_keys = JSON.parse($.base64.decode(asocial.state.invite.new_keys));

    asocial.auth.getPasswordLocal(function (password) {

      var sB_salt = asocial.crypto.generateRandomHexSalt();
      var sB = asocial.crypto.calculateHash(password, sB_salt);

      var keylist = asocial_keylist();

      var public_keys = {};

      $.each(keylist, function (id, key) {
        public_keys[id] = asocial.crypto.serializePublicKey(key);
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

      var group_id = asocial.binders.getCurrentGroup();
      
      var update = $.param({
        keylist: keylist,
        keylist_salt: sB_salt,
        group_id: group_id
      });
      
      $.post('/invite/update', update, function (data) {

        if (data.status == 'ok') {
          
          var ack = $.param({
            type: 'update',
            group_id: group_id,
            new_keys: Object.keys(new_keys)
          });
        
          $.post('/invite/acknowledge', ack, function () {
            // alert('Added a new group member to your keys!');
            _this.refreshKeys();
          });
          
        } else {
          alert('An error has occured with key update.');
        }

      });
      
    });
    
  },
  
  refreshKeys: function () {
    asocial.state.getState('group', function () {
      asocial.auth.getPasswordLocal(asocial.crypto.decryptKeylist);
    }, { group_id: asocial.binders.getCurrentGroup(), force: true })
  }
  
});