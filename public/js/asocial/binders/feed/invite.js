asocial.binders.add('feed', { invite: function(){

  $('.invite-confirm').click(function(e) {

    e.preventDefault();
    
    var $that = $(this);
    
    function recrypt(rsa, arr) {
      
      var result = [];
      
      $.each(arr, function (ind, elem) {
        var key = rsa.encrypt(
          asocial_private_key().decrypt(elem.key));
  
        result.push({id: elem.id, key: key});
      });
      
      return result;
      
    }
    
    function recryptPosts(rsa, posts) {
      
      var result = [];
      
      $.each(posts, function (ind, post) {
        var key = rsa.encrypt(
          asocial_private_key().decrypt(post.key));
          
        result.push({id: post.id, key: key,
          comments: recrypt(rsa, post.comments)});
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
       var p_sB = $.base64.decode($that.data('invite-p_sb'));
       var k_P = $.base64.decode($that.data('invite-k_p'));
       var PA_k = $.base64.decode($that.data('invite-pa_k'));
       var sB_salt = $that.data('invite-sb_salt');
       
       var sB = asocial.crypto.calculateHash(
         password, sB_salt);

       // 3B.
       console.log("3B");
       var p = asocial.crypto.buildPrivateKey(JSON.parse(
         $.base64.decode(sjcl.decrypt(sB, p_sB))));

       // 3C.
       console.log("3C");
       var k = p.decrypt(k_P);

       // 3D.
       console.log("3D");
       var PA = JSON.parse(sjcl.decrypt(k, PA_k));

       // 3E.
       console.log("3E");
       
       // Get serialized key list.
       var public_keys = asocial.crypto.serializeKeyList();
       
       // Add new user to key list.
       public_keys[id_A] = PA;
       
       // Generate a new keylist salt.
       var keylist_salt = asocial.crypto.generateRandomHexSalt();

       // Generate a hash from the keylist salt.
       var key = asocial.crypto.calculateHash(password, keylist_salt);

       // Encrypt the public key list.
       var keylist = asocial.crypto.encryptKeyList(key, public_keys);

       // Store keylist for A encrypted using k.
       var PPA_k = sjcl.encrypt(k, JSON.stringify(public_keys));
       
       var group_id = asocial.binders.getCurrentGroup();
       
      $.get('/' + group_id + '/invite/keys',
        $.param({invite_id: invite_id }), function (keyData) {

         // Generate integration data for server.
         var confirmation = $.param({

           group_id: group_id,

           invite_id: invite_id,
           PPA_k: $.base64.encode(PPA_k),

           invitee_id: id_A, // not strictly necessary?
           keys: recryptKeys(asocial.crypto.buildPublicKey(PA), keyData.keys),
           keylist: keylist,
           keylist_salt: keylist_salt,


        });

       $.post('/invite/confirm', confirmation, function (data) {

         if (data.status == 'ok') {
           
           var PA_msg = JSON.stringify(asocial.crypto.encryptMessage(JSON.stringify(PA)));
          
           console.log(PA_msg);
          
           var broadcast = $.param({
             public_key: PA_msg, invitee_id: id_A,
             group_id: asocial.binders.getCurrentGroup()
           });

           $.post('/invite/broadcast', broadcast, function (data) {

             if (data.status == 'ok') {
               //alert('Go back to groups panel and click on the group.');
               $that.append('Invite confirmed!');
               
             } else {
               alert('An error has occured with broadcasting.');
             }
           
           });

         } else {
         
           alert('An error has occured with confirmation.');
         
         }
             
       });

      });
        
  
    });
    
  });


} }); // asocial.binders.add();


