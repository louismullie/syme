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
  
  createInviteRequests: function (keylistId, emails, inviteCreatedCb, errorCb) {
    
    var _this = this;
    var invitation = new Invitation();
    
    Crypto.createInviteRequests(keylistId, emails, function (inviteInfos) {
      
      var counter = emails.length;

      _.each(inviteInfos, function (inviteInfo) {

          var email = inviteInfo.alias,
              request = inviteInfo.request;

          var inviteRequest = request[0];
          var inviteToken = request[1];

          invitation.save(
            {
              group_id: keylistId,
              email: email,
              request: inviteRequest
            },
            {
              success: function () {
                Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {
                  _this.updateKeyfile(encryptedKeyfile, function () {
                    counter--;
                    if (counter == 0)
                      inviteCreatedCb(inviteInfos);
                  });
                });
              },
              error: function (model, response) {
                counter--;
                if (counter == 0)
                  inviteCreatedCb(inviteInfos);
              }
          });

      });
      
    });

  },
  
  acceptInviteRequest: function (invitationId, request, token, inviteAcceptedCb, errorCb) {
    
    var _this = this;
    var invitation = new Invitation();
    invitation.set('_id', invitationId);

    Crypto.acceptInviteRequest(request, token, function (inviteRequest) {
      
        invitation.save(
          { accept: inviteRequest },
          {
            success: function () {
              Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {
                _this.updateKeyfile(encryptedKeyfile, inviteAcceptedCb);
              });
            },
            error: function (error) {
              console.log(error);
              alert('WHORE!');
              asocial.helpers.showAlert("This invitation does not exist anymore.");
            }
        });
      
    });

  },
  
  confirmInviteRequest: function (invitationId, accept, inviteConfirmedCb, errorCb) {
    
    var _this = this;
    
    var invitation = new Invitation();
    invitation.set('_id', invitationId);

    Crypto.confirmInviteRequest(accept, function (inviteRequestJson) {
        
        if (inviteRequestJson.error)
          return errorCb();
        
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
  
  completeInviteRequest: function (groupId, invitationId, completeRequest, inviteCompletedCb, errorCb) {
    
    var _this = this;

    var invitation = new Invitation();
    invitation.set('_id', invitationId);
    
    Crypto.completeInviteRequest(completeRequest, function () { // This causes the error
        
        var acknowledgement = { invitation_id: invitationId };
        
        invitation.save(
          { completed: true },
          {
            success: function () {
              
              Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {
                
                _this.updateKeyfile(encryptedKeyfile, function () {
                  _this.acknowledgeIntegrate(groupId, acknowledgement, inviteCompletedCb);
                });
                
              });
            },
            error: errorCb
        });
      
    });

  },
  
  transferKeysRequest: function (groupId, invitationId, inviteeId, transferredKeysCb, errorCb) {
    
    var invitation = new Invitation();
    invitation.set('_id', invitationId);
    
    var url = SERVER_URL + '/users/' + CurrentSession.getUserId() +
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
          
          _this.acknowledgeDistribute(acknowledgements, addedUsersCb);
          
        });
        
      });
      
    });
    
  },
  
  acknowledgeIntegrate: function(groupId, acknowledgement, acknowledgedCb) {
    
    var url = SERVER_URL + '/users/' + CurrentSession.getUserId() + '/groups/' +
              groupId + '/invitations/acknowledge';

    var data = { integrate: acknowledgement };
    
    $.ajax(url, { type: 'POST', data: data,
      
      success: acknowledgedCb,
      error: function () { alert('Integrate error!'); }
      
    });
    
  },
  
  acknowledgeDistribute: function (acknowledgements, acknowledgedCb) {
    
    var url = SERVER_URL + '/users/' + CurrentSession.getUserId() + 
              '/invitations/acknowledge';
    
    var data = { distribute: acknowledgements };

    $.ajax(url, { type: 'POST', data: data,

      success: acknowledgedCb,
      error: function () { alert('Distribute error!'); }

    });
    
  },
  
  getAllGroupUpdates: function (groupId, updatedGroupsCb) {
    
    var groups = CurrentSession.getGroups();
    
    var counter = groups.length;
    var _this = this;
    
    if (counter == 0) updatedGroupsCb();
    
    _.each(groups, function (groupId) {
      
      counter--;
      
      _this.getGroupUpdates(groupId, function () {
        if (counter == 0) updatedGroupsCb();
      });

    });
    
  },
  
  getGroupUpdates: function (groupId, updatedGroupsCb) {
    
    var url = SERVER_URL + '/users/' + this.get('_id') + 
      '/groups/' + groupId + '/invitations';
    
    var _this = this;
    
    $.getJSON(url, function (groupUpdates) {
      
        if (groupUpdates.integrate) {
          
          var invitationId = groupUpdates.integrate.id;
          var groupId = groupUpdates.integrate.group_id;
          var request = groupUpdates.integrate.request;
          
          if (groupUpdates.distribute) {
            
            _this.completeInviteRequest(groupId, invitationId, request, function () {
                _this.addUsersRequest(groupUpdates.distribute, updatedGroupsCb);
            });
            
          } else {
            
            _this.completeInviteRequest(groupId, invitationId, request, updatedGroupsCb);
            
          }
          
        } else if (groupUpdates.distribute) {
          
          _this.addUsersRequest(groupUpdates.distribute, updatedGroupsCb);
          
        } else {
          
          updatedGroupsCb();
          
        }
        
    });
    
  },
  
  updateKeyfile: function (encryptedKeyfile, keyfileUpdatedCb) {
    
    var _this = this;
    
    this.set('keyfile', encryptedKeyfile);
    
    Crypto.getSerializedKeyfile(function (e) {
      console.log("[Backbone] Updated key file", e);
    });
    
    this.save(null, {
      success: keyfileUpdatedCb,
      error: _this.userSaveError
    });
    
  },
  
  refreshKeyfile: function (refreshedKeyfileCb) {
    
    $.ajax(SERVER_URL + '/users/' + this.get('_id'), { type: 'GET',
      success: function (user) {
        CurrentSession.retrievePassword(function (p) {
          Crypto.initializeKeyfile(
            user._id, p,
            user.keyfile,
            refreshedKeyfileCb
          );
        });
    }});
    
  },
  
  userSaveError: function () {
    alert('Error while saving user!');
  }

});