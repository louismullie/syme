// Our basic Todo model has text, order, and done attributes.
var User = Backbone.RelationalModel.extend({

  idAttribute: "_id",
  url: SERVER_URL + '/users',

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

    Crypto.confirmInviteRequest(accept, function (inviteRequestJson) {
        
        invitation.save(
          { integrate: inviteRequestJson.inviteConfirmation,
            distribute: inviteRequestJson.addUserRequest },
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
  
  completeInviteRequest: function (invitationId, completeRequest, inviteCompletedCb, errorCb) {
    
    var _this = this;

    var invitation = new Invitation();
    invitation.set('_id', invitationId);

    Crypto.completeInviteRequest(completeRequest, function () {
        
        var acknowledgement = { invitation_id: invitationId };
        
        invitation.save(
          { completed: true },
          {
            success: function () {
              
              Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {
                _this.updateKeyfile(encryptedKeyfile, function () {
                  _this.acknowledge('integrate', acknowledgement, inviteCompletedCb);
                });
              });
            },
            error: errorCb
        });
      
    });

  },
  
  transferKeysRequest: function (invitationId, inviteeId, transferredKeysCb, errorCb) {
    
    var invitation = new Invitation();
    invitation.set('_id', invitationId);
    
    var groupId = CurrentSession.getGroupId();
    
    var url = '/users/' + CurrentSession.getUserId() +
    '/groups/' + groupId + '/keys';
    
    $.getJSON(url, function (keys) {
      
      Crypto.transferKeysRequest(groupId, inviteeId, keys,
      
        function (recryptedKeys) {
          
          invitation.save(
            { transfer: recryptedKeys },
            {
              success: transferredKeysCb,
              error: errorCb
          });
          
      });
      
    });
    
  },
  
  addUsersRequest: function (addUsersRequest, addedUsersCb) {
    
    var _this = this;
    
    Crypto.addUsersRequest(addUsersRequest, function (acknowledgements) {
      
      Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {
        
        _this.updateKeyfile(encryptedKeyfile, function () {
          _this.acknowledge('distribute', acknowledgements, addedUsersCb);
        });
        
      });
      
    });
    
  },
  
  acknowledge: function(type, acknowledgement, acknowledgedCb) {
    
    var url = '/users/' + CurrentSession.getUserId() + '/groups/' +
              CurrentSession.getGroupId() + '/invitations/acknowledge';
    
    var data = {}; data[type] = acknowledgement;
    
    $.ajax(url, { type: 'POST', data: data,
      
      success: acknowledgedCb,
      error: function () { alert('error!'); }
      
    });
    
  },
  
  getGroupUpdates: function (groupId, updatedGroupsCb) {
    
    var url = '/users/' + this.get('_id') + 
      '/groups/' + groupId + '/invitations';
    
    var _this = this;
    
    $.getJSON(url, function (groupUpdates) {
      
        if (groupUpdates.integrate) {
          
          var invitationId = groupUpdates.integrate.id;
          var request = groupUpdates.integrate.request;
          
          if (groupUpdates.distribute) {
            
            _this.completeInviteRequest(invitationId,
              request, function () {
                _this.addUserRequest(invitationId,
                  groupUpdates.distribute, updatedGroupsCb);
            });
            
          } else {
            
            _this.completeInviteRequest(
              invitationId, request, updatedGroupsCb);
            
          }
          
        } else if (groupUpdates.distribute) {
          
          _this.addUsersRequest(
            distribute.requests, updatedGroupsCb);
          
        } else {
          
          updatedGroupsCb();
          
        }
        
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