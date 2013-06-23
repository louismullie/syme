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
      var private_key = asocial.crypto.ecc.buildPrivateKey(keypair.private_key);

      // Build an RSAKey() object from the serialized public key.
      var public_key = asocial.crypto.ecc.buildPublicKey(keypair.public_key);

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
        keylist[userId] = asocial.crypto.ecc.buildPublicKey(publicKeyInfo);
      });

      window.asocial_keylist = function() { return keylist; }

      return true;

    }  catch(e) {

      // Return false if decryption failed due to wrong password.
      return false;

    }
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
      public_keys[id] = _this.ecc.serializePublicKey(key);
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
      encrypted_keys[user_id] = asocial.crypto.ecc.encrypt(public_key, msg_key);
    });
    
    //alk = encrypted_keys;
    
    return encrypted_keys;

  },

  // Generate a new public/private key pair.
  generateEncryptedKeyPair: function (hash) {
    return this.encryptKeyPair(hash, this.generateRSA(false));
  },

  generateRSA: function (with_rsa) {

    //rsa = new RSAKey();
    //rsa.generate(1024, "10001");

    var key = this.ecc.generateKeys();
    
    var keypair = {
      private_key: asocial.crypto.ecc.serializePrivateKey(key.sec),
      public_key: asocial.crypto.ecc.serializePublicKey(key.pub),
    };

    if (with_rsa) {
      keypair.rsa_key = key;
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
      public_keys[user_id] = _this.ecc.buildPublicKey(public_info);
    });

    return public_keys;

  },


  // Decrypt message using message key and private key.
  decryptMessage: function(message, msg_key) {

    var private_key = asocial_private_key();
    var msg_key = asocial.crypto.ecc.decrypt(private_key, msg_key);
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
        decrypted = marked(decrypted);
        
        // Show the user tags.
        decrypted = asocial.helpers.replaceUserMentions(decrypted);
        
        // Hide the "This post is encrypted notice."
        $(element).parent().find('.encrypted_notice').remove();
        
        // Markdown the message and insert in place.
        $(element).replaceWith(decrypted);
        
      });

      asocial.helpers.formatPostsAndComments();

    } catch (e) {

      asocial.helpers.showAlert('Could not decrypt resource.');

    }

  },

  // Rename to decryptmedia.
  decryptMedia: function() {

    var _this = this;

    $.each($('.encrypted-image, .encrypted-audio, .encrypted-video'), function (index, image) {

      var image = $(image);

      var id = image.data('attachment-id');
          key = image.data('attachment-key'),
          type = image.data('attachment-type'),
          group = image.data('attachment-group');

      // Safe global variable?
      key = asocial.crypto.ecc.decrypt(asocial_private_key(), key);

      _this.getFile(id, key, function (url) {

        if (type == 'image') {
          image.attr('src', url);
          image.removeClass('encrypted-image');
        } else if (type == 'video') {
          image.attr('src', url);
          image.removeClass('encrypted-video');
          //image.mediaelementplayer();
        } else {
          asocial.helpers.showAlert("No handler for audio!");
        }

      }, group);

    });

    $.each($('.encrypted-background-image'), function (index) {

      var $this = $(this);

      var id = $this.data('attachment-id'),
          key = $this.data('attachment-key'),
          group = $this.data('attachment-group');

      // Safe global variable?
      key = asocial.crypto.ecc.decrypt(asocial_private_key(), key);

      _this.getFile(id, key, function (url) {

        $this.css("background-image", "url('" + url + "')");

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
      key = asocial.crypto.ecc.decrypt(asocial_private_key(), key);

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
  },

  testPEM: function () {

    var decryptedHexKey = PKCS5PKEY.getDecryptedKeyHex("-----BEGIN RSA PRIVATE KEY-----\nProc-Type: 4,ENCRYPTED\nDEK-Info: AES-128-CBC,9388FB300C43FA748A7B3F6D2C576765\n\nW0dc/M4XISrMIxarDBVyUv1AXh9qYYiuiCKJCihaShjDNF9PhVDdzYLlEG+/Ex0E\nfzgpdJd2jzLiV+DDAbOT76XrkbyL0ld5bWlab1D5F196sfmGW39FufadVT6WaC5b\na3NfLpU+io3PZPm4VM6GbIubZlYOMwNl4cN5z/pyaJjtVHiYVq4rD4XIKcEAAW1X\n0lYzfYz6o7/PiZhUjICmcQ1XkvuF8KEaHrkKbYrEC1y/u0+RdxaRdIR5glG7z4Ot\nL4GJIykT6wrfQagsp+El63TI+1/LYVfAeZDnt9bKnn/OiJ6Xvbih4nisTEaKnqiW\n64aalxxownu/aqkzjq7w11RXWVb0vKy0FJUF6wHKrbZTXHlm0O9oPmxEZcp3zXqw\nsnkozbuy7PcGFHgzuZBJTtJK4wpuzj/zTJ+2Ph61vkJ74vywCPq2wbhXNOF4tXf+\npSwj25rWOhbgGKMtZlYKFt9q78SogXgj/27AIL0Br2QFFx1oMhk8K6euIWMweLZE\ngVrfDWk95pf/oIRpfGPZguJqFRtJ+GviQ9NKEFwvg90UbdfqFa78He2uisQp7NcE\nEQHmn9tLymlhjrkVLrxlighrPeUIp8wITGT/yre/qv/0VYSxqovyUX5wgMcMgm8F\n7WkD3uebuMuCMleOQFqnKfBvyyrfU8YGYA8gj+4RxjqCHHPfrl5AJIq2g57jcUU4\nH2seDySpULO3Lt7xsKFrxOX7sCS+sH0Gk5YAJFFfseLgr68EzDQVogbv4+hm8Dw0\nynlfNYwTWZnX3SlgX6Hq8Ro3XHq1It5bKVPkO2BrI1e+MFcBy/p8wEPwmvfCYeuX\nlX1KApLBp+a2BhrSdDMqIcU30XVihg4NweGvZi6B55I6gOPt3ExVegXAL0YHe7ky\nN4k8uDNmy1Er3/HALATg3DJEHkZthsSmVqotSMP5wOVClDv/C8lOcOErkKEg7coZ\nthl0HiDr+QPlY3UyYIu4nqRgVgboY7MCMAukIO4DY5uv3DtIomhsX/EmipDFw7m7\n1uCdPiWQ6WriRyd763gYTe9vlREje0kc2Fj1C2J1RLg6n7cHcnCrClj7PeqhLK7L\n4IqvT/tdzf/L8KL1RizJljDBPWEe+EqDdFCpKbdkix6h8oiQy9hGyW+8aYKzin0n\nc6UAURGDWGptAHPX5/Bi3OT0KzdizRM9nNrG45zw4DwbmQ8KxaZIHmy5FWYVfS+x\nz0c+J4wAFl96anX1SnwWnEBhovjri3divFAAfT6/5KfH7R5WkeCZSTNvkoEmOPuj\nW8I8N8lJzOzinY7EcwE7yMoPKJ+iB4flPCqzQ5zjfIhDd2S6GmQXXQhfLS0x2x+q\ntE5DR3sDxc/ugYlRpLzJrJYwnxFcJ5SE8gLphu15P+R5iRkxDcygetpPfOJjYBop\nsZ3mJsrV2OGKRMqEGLUZ3/TM9tYfKhtq2crcRZC+5GoG1s8lplM742hEHm/NM3+N\nmS0/GAKQ+r3AjNPX4brbzkmoJtoI7dIbDfyBZAV/ssZxRyW4jm/OcnI2fjvBeCp6\njTX+XvbZgRFvh3iOrARkHtxfXzne1egD4eApuB4jRxikzk4ZYnGRx6q90T1i5H4+\n-----END RSA PRIVATE KEY-----\n", "password");

    var rsa = new RSAKey();
    rsa.readPrivateKeyFromASN1HexString(decryptedHexKey);

    var pem = PKCS5PKEY.getEryptedPKCS5PEMFromRSAKey(rsa, "password", "AES-128-CBC");

    return rsa;

  },

  encode: function (json) {
    return $.base64.encode(JSON.stringify(json));
  },

  decode: function (base64) {
    return JSON.parse($.base64.decode(base64));
  },
  
  ecc: {
    
    generateKeys: function () {
      return sjcl.ecc.elGamal.generateKeys(384, 1);
    },
    
    serializePublicKey: function (publicKey) {
      return publicKey.serialize();
    },
    
    serializePrivateKey: function (privateKey) {
      return privateKey.serialize();
    },
    
    buildPublicKey: function (pubJson) {
      
      var point = sjcl.ecc.curves["c" + pubJson.curve].fromBits(pubJson.point);
      
      var publicKey = new sjcl.ecc.elGamal.publicKey(pubJson.curve, point.curve, point);
      
      return publicKey;
    },
    
    buildPrivateKey: function (privJson) {
      
      var exponent = sjcl.bn.fromBits(privJson.exponent);
      
      var curve = "c" + privJson.curve;
      var privateKey = new sjcl.ecc.elGamal.secretKey(
          privJson.curve, sjcl.ecc.curves[curve], exponent);
          
      return privateKey;
    },
    
    encrypt: function (publicKey, data) {
      
      var symKey = publicKey.kem(0);
      var ciphertext = sjcl.encrypt(symKey.key, data);
      
      var message = JSON.stringify({
        'ciphertext': ciphertext,
        'encrypted_key': symKey.tag
      });
      
      return $.base64.encode(message);
    },
    
    decrypt: function (privateKey, message) {
      
      var cipherMessage = JSON.parse($.base64.decode(message));
      
      var symKey = privateKey.unkem(cipherMessage.encrypted_key);
      var decryptedData = sjcl.decrypt(symKey, cipherMessage.ciphertext);
      
      return decryptedData;
      
    }
    
  }

});