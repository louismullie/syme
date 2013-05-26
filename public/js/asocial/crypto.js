guard('crypto', {

  /* 
   * Decrypt the current user's keypair and store
   * the keys in the methods asocial_private_key()
   * as well as asocial_public_key().
   */
  decryptKeypair: function(password) {

    try {
      
      // Retrieve the salt that derives the encryption key.
      var salt  = asocial.state.user.keypair_salt;
      
      // Derive the encryption key from the password.
      var key = asocial.crypto.calculateHash(password, salt);

      // Retrieve the user's encrypted keypair.
      var keypair = asocial.state.user.keypair;
      
      // Retrieve the JSON string representing the keypair.
      var keypairSjcl = $.base64.decode(keypair);
      
      // Decrypt the keypair using the symmetric key.
      var decryptedKeypairJson = sjcl.decrypt(key, keypairSjcl);
      
      // Parse the decrypted keypair as JSON text.
      var keypair = $.parseJSON(decryptedKeypairJson);
      
      // Build an RSAKey() object from the serialized private key.
      var private_key = asocial.crypto.buildPrivateKey(keypair.private_key);
      
      // Build an RSAKey() object from the serialized public key.
      var public_key = asocial.crypto.buildPublicKey(keypair.public_key);

      // Define the private and public keys and prevent overwrite.
      guard('private_key', function () { return private_key; });
      guard('public_key', function () { return public_key; });

      // Return true if the keys were successfully decrypted.
      return true;

    } catch(e) {
      // Return false if decryption failed due to wrong password.
      return false;
      
    }

  },
  
  // TODO: refactor this with decryptKeypair.
  decryptKeylist: function (password) {
    
    try {
      
      var keylist = asocial.state.group.keylist;
      var keylistSjcl = $.base64.decode(keylist);
      
      var salt  = asocial.state.group.keylist_salt;
      
      var key = asocial.crypto.calculateHash(password, salt);
      
      var decryptedKeylist = sjcl.decrypt(key, keylistSjcl);

      var keylistJson = $.parseJSON(decryptedKeylist);
      
      var keylist = {};
      
      $.each(keylistJson, function (userId, publicKeyInfo) {
        keylist[userId] = asocial.crypto.buildPublicKey(publicKeyInfo);
      });

      window.asocial_keylist = function() { return keylist; }
      
      return true;

    }  catch(e) {

      // Return false if decryption failed due to wrong password.
      return false;

    }
  },

  /* 
   * Build an RSAKey() object for a public
   * key based on the key numbers "n" and "e",
   * stored in string format in keyInfo.
   */
  buildPublicKey: function (keyInfo) {

    // Create a blank RSAKey object.
    var publicKey = new RSAKey();

    // Set the public information from key info.
    publicKey.setPublic(keyInfo.n, keyInfo.e);

    // Return public key.
    return publicKey;

  },
  
  encryptKeyList: function (hash, keylist) {
    
    return $.base64.encode(sjcl.encrypt(hash, JSON.stringify(keylist)));
    
  },
  
  serializePublicKey: function (publicKey) {
    
    return {
      n: publicKey.n.toString(16),
      e: publicKey.e.toString(16)
    };
    
  },
  
  serializeKeyList: function () {
    
    var public_keys = {};
    var _this = this;
    
    $.each(asocial_keylist(), function (id, key) {
      public_keys[id] = _this.serializePublicKey(key);
    });
    
    return public_keys;
    
  },
  
  userPublicKey: function(id) {
    id = id || asocial.state.user.id;
    return asocial_keylist()[id];
  },

  decrypt: function () {

    var _this = this;
    
    _this.decryptAvatars();
    _this.decryptPostsAndComments();
    _this.decryptMedia();
    
    $('time.timeago').timeago();

  },
  
  /*
   * Hash a password using PBKDF2 with a salt,
   * performing 2000 iterations of SHA256.
   */
  calculateHash: function (pass, salt) {
    
    hash = sjcl.misc.pbkdf2(pass, salt, 2000, 256);
    
    return hash;
    
  },

  encryptMessage: function(message) {

    var msg_key = this.generateRandomKey();
    var encrypted_message = sjcl.encrypt(msg_key, message);
    var encrypted_keys = this.generateMessageKeys(msg_key);

    return {
      content: encrypted_message,
      keys: encrypted_keys
    };

  },

  generateRandomKey: function () {

    var rand = sjcl.codec.hex.fromBits(sjcl.random.randomWords(2, 0));
    var msg_hash = new sjcl.hash.sha256.hash(rand);
    var msg_key = sjcl.codec.hex.fromBits(msg_hash);
    return msg_key;

  },

  generateMessageKeys: function (msg_key) {

    var public_keys = asocial_keylist();
    var encrypted_keys = {};

    $.each(public_keys, function (user_id, public_key) {
      encrypted_keys[user_id] = public_key.encrypt(msg_key);
    });

    return encrypted_keys;

  },

  // Generate a new public/private key pair.
  generateEncryptedKeyPair: function (hash) {
    return this.encryptKeyPair(hash, this.generateRSA(false));
  },

  generateRSA: function (with_rsa) {

    rsa = new RSAKey();
    rsa.generate(1024, "10001");

    var public_key = {
      n: rsa.n.toString(16),
      e: rsa.e.toString(16)
    };

    var private_key = {
      n: rsa.n.toString(16),
      e: rsa.e.toString(16),
      d: rsa.d.toString(16),
      p: rsa.p.toString(16),
      q: rsa.q.toString(16),
      dmpq: rsa.dmp1.toString(16),
      dmq1: rsa.dmq1.toString(16),
      iqmp: rsa.coeff.toString(16)
    };

    var keypair = {
      private_key: private_key,
      public_key: public_key,
    };

    if (with_rsa) {
      keypair.rsa_key = rsa;
    }

    return keypair;

  },

  encryptKeyPair: function (hash, keypair) {

    var keys = {
      private_key: keypair.private_key,
      public_key: keypair.public_key
    };

    return $.base64.encode(sjcl.encrypt(hash, JSON.stringify(keys)));

  },

  // Decode the Base64-encoded public keys.
  buildPublicKeys: function(public_key_infos) {

    var public_keys = {};
    var _this = this;

    $.each(public_key_infos, function(user_id, public_info) {
      public_keys[user_id] = _this.buildPublicKey(public_info);
    });

    return public_keys;

  },


  buildPrivateKey: function (private_info) {

    var private_key = new RSAKey();

    private_key.setPrivateEx(private_info.n, private_info.e,
    private_info.d, private_info.p, private_info.q,
    private_info.dmpq, private_info.dmq1, private_info.iqmp);

    return private_key;
  },

  // Decrypt message using message key and private key.
  decryptMessage: function(message, msg_key) {

    var private_key = asocial_private_key();
    var msg_key = private_key.decrypt(msg_key);
    return sjcl.decrypt(msg_key, message);

  },

  decryptPostsAndComments: function() {
    
    try {
     
      var _this = this;
      // Decrypt each encrypted post on the page.
      $.each($('.encrypted'), function (i, element) {
        var message = $.parseJSON(element.innerText);
        message.content = JSON.stringify(message.content); // This is hacky...
        // Decrypt the message using the message key and private key.
        var decrypted = asocial.crypto.decryptMessage(message.content, message.key);
        decrypted = marked(html_sanitize(decrypted));
        // Show the user tags.
        decrypted = asocial.helpers.replaceUserMentions(decrypted);
        // Hide the "This post is encrypted notice."
        $(element).parent().find('.encrypted_notice').remove();
        // Markdown the message and insert in place.
        $(element).replaceWith(decrypted);
      });

      asocial.helpers.formatPostsAndComments();
       
    } catch (e) {
      
      alert('Could not decrypt resource.');
      
    }
    
  },

  // Rename to decryptmedia.
  decryptMedia: function() {

    var _this = this;

    $.each($('.encrypted-image, .encrypted-audio, .encrypted-video'), function (index, image) {

      var image = $(image);

      var id = image.data('attachment-id');
      var key = image.data('attachment-key');
      var type = image.data('attachment-type');
      var group = image.data('attachment-group');

      key = asocial_private_key().decrypt(key);

      _this.getFile(id, key, function (url) {

        if (type == 'image') {
          image.attr('src', url);
          image.removeClass('encrypted-image');
        } else if (type == 'video') {
          image.attr('src', url);
          image.removeClass('encrypted-video');
          //image.mediaelementplayer();
        } else {
          alert("No handler for audio!");
        }

      }, group);

    });
  },

  decryptAvatars: function() {

    var _this = this;

    $.each($('.user-avatar'), function (index, element) {

      var element = $(element);
      var user_id = $(this).parent().attr('id');

      var id = element.data('id');
      if (id == '') { return; }
      
      var key = element.data('key');
      key = asocial_private_key().decrypt(key);
      
      _this.getFile(id, key, function (url) {
        var avatars = $('.encrypted-avatar[data-user-id="' + user_id + '"]');
        $.each(avatars, function (index, element) { element.src = url; });
      });

    });

  },

  getFile: function (id, key, callback, group) {
    
    var display = function(id, blob, save) {
      
      if (save) {

        var reader = new FileReader();

        reader.onload = function(event){
          var base64 = event.target.result;
          console.log("STORING!!!");
          store.save({ key: id, value: base64 });
        };

        reader.readAsDataURL(blob);

      }

      var url = URL.createObjectURL(blob);

      callback(url);

    };
    
    var download = function (id, key, group) {
      
      var group = group || asocial.binders.getCurrentGroup();
      
      var baseUrl = '/' + group + '/file/';
      
      var downloader = new Downloader(id,
          key, { baseUrl: baseUrl } );
      
      downloader.start(
        function() {},
        function(blob) {
          display(id, blob, true);
      });
      
    };
    
    var store = new Lawnchair(

      {
        adapter: 'indexed-db',
        name: 'asocial' //,
        //storage: 'PERSISTENT'
      },
      
      function(store) {

        store.get(id, function(me) {
          
          if (typeof(me) == "undefined") {
            
            download(id, key, group);
            
          } else {
            
            var blob = asocial.thumbnail
              .dataURItoBlob(me.value);
            display(id, blob, false);
            
          }
        });

    });

  },
  
  generateRandomHexSalt: function (words) {
    var words = words || 4;
    return sjcl.codec.hex.fromBits(sjcl.random.randomWords(words,0));
  }

});