// Our basic Todo model has text, order, and done attributes.
var User = Backbone.RelationalModel.extend({

  idAttribute: "_id",
  url: 'http://localhost:5000/users',

  relations: [
  {
    type: Backbone.HasOne,
    key: 'verifier',
    relatedModel: 'Verifier',
    reverseRelation: {
      key: 'user'
    }
  }],

  createKeyfile: function (password, keyfileCreatedCb) {

    var _this = this, email = this.get('email');
    console.log(6);
    Crypto.initializeKeyfile(email, password, null, function (encryptedKeyfile) {
      _this.updateKeyfile(encryptedKeyfile, keyfileCreatedCb);
    });
  
  },
  
  createKeylist: function (keylistId, keylistCreatedCb) {

    var _this = this;
    
    Crypto.createKeylist(keylistId, function (encryptedKeyfile) {
      _this.updateKeyfile(encryptedKeyfile, keylistCreatedCb);
    });
    
  },
  
  deleteKeylist: function (keylistId, keylistDeletedCb) {
    
    var _this = this;
    
    Crypto.deleteKeylist(keylistId, function (encryptedKeyfile) {
      _this.updateKeyfile(encryptedKeyfile, keylistDeletedCb);
    });
    
  },
  
  createInviteRequest: function (keylistId, email, inviteCreatedCb, errorCb) {
    
    var _this = this;
    var invitation = new Invitation();
    
    Crypto.createInviteRequest(keylistId, email, function (inviteRequest) {
      
        invitation.save(
          {
            group_id: keylistId,
            email: email,
            request: inviteRequest
          },
          {
            success: function () {
              Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {
                _this.updateKeyfile(encryptedKeyfile, inviteCreatedCb);
              });
            },
            error: errorCb
        });
      
    });

  },
  
  acceptInviteRequest: function (invitationId, request, inviteAcceptedCb, errorCb) {
    
    var _this = this;
    var invitation = new Invitation();
    invitation.set('_id', invitationId);

    Crypto.acceptInviteRequest(request, function (inviteRequest) {
      
        invitation.save(
          { accept: inviteRequest },
          {
            success: function () {
              Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {
                _this.updateKeyfile(encryptedKeyfile, inviteAcceptedCb);
              });
            },
            error: errorCb
        });
      
    });

  },
  
  confirmInviteRequest: function (invitationId, accept, inviteConfirmedCb, errorCb) {
    
    var _this = this;
    
    var invitation = new Invitation();
    invitation.set('_id', invitationId);

    Crypto.confirmInviteRequest(accept, function (inviteRequest) {
      
        invitation.save(
          { confirm: inviteRequest },
          {
            success: function () {
              Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {
                _this.updateKeyfile(encryptedKeyfile, inviteConfirmedCb);
              });
            },
            error: errorCb
        });
      
    });

  },
  
  updateKeyfile: function (encryptedKeyfile, keyfileUpdatedCb) {
    
    var _this = this;
    
    console.log(_this);
    this.set('keyfile', encryptedKeyfile);
    
    Crypto.getSerializedKeyfile(function (e) {
      console.log("[Backbone] Updated key file", e);
    });
    
    this.save(null, {
      success: keyfileUpdatedCb,
      error: _this.userSaveError
    });
    
  },
  
  userSaveError: function () {
    alert('Error while saving user!');
  }

});