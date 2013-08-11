// Our basic Todo model has text, order, and done attributes.
var User = Backbone.RelationalModel.extend({

  idAttribute: "id",
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

  /*
  sync: function(method, model, options) {
    
    console.log(method, options);
    
    options.data = options.data || {};

    var data = JSON.stringify(options.data);

    var encryptedData = sjcl.encrypt('password', data);

    options.data = { encrypted: true, data: encryptedData };

    var success = options.success;

    options.success = function (jsonResponse) {
      var txtResponse = JSON.stringify(jsonResponse);
      var decryptedResponse = sjcl.decrypt('password', txtResponse);
      var response = JSON.parse(decryptedResponse);
      var model = new User(response);
      success(model, response);
    };
     
    Backbone.sync(method, model, options);
    
  },
  */
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

      var inviteCreatedCbWrapper = function () {
        counter--;
        if (counter == 0)
          inviteCreatedCb(inviteInfos);
      };
      
      Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {
        
        _this.updateKeyfile(encryptedKeyfile, function () {
          
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
                  success: inviteCreatedCbWrapper,
                  error: inviteCreatedCbWrapper
              });
          
          });
    
        });
      
      });
    
    });

  },
  
  acceptInviteRequest: function (invitationId, request, token, inviteAcceptedCb, errorCb) {
    
    var _this = this;
    var invitation = new Invitation();
    invitation.set('id', invitationId);

    Crypto.acceptInviteRequest(request, token, function (inviteRequest) {
      
      Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {
        
        _this.updateKeyfile(encryptedKeyfile, function () {
          
          invitation.save(
            { accept: inviteRequest },
            {
              success: inviteAcceptedCb,
              error: function (error) {
                asocial.helpers.showAlert("This invitation does not exist anymore.");
              }
          });
          
        });
      
      });
    
    });

  },
  
  confirmInviteRequest: function (keylistId, invitationId, inviteeId, inviteRequest, inviteConfirmedCb, errorCb) {
    
    var _this = this;
    
    var invitation = new Invitation();
    invitation.set('id', invitationId);
    
   
   var url = SERVER_URL + '/users/' + CurrentSession.getUserId() + '/groups/' + keylistId + '/keys';
  
    $.getJSON(url, function (keysJson) {
    
      Crypto.confirmInviteRequest(keylistId, inviteeId, inviteRequest, keysJson, function (inviteRequestJson) {
        
          if (inviteRequestJson.error)
            return errorCb();
      
          console.log(inviteRequestJson.keys);
          
          Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {
            
            _this.updateKeyfile(encryptedKeyfile, function () {
                
                console.log(inviteRequestJson);
                
                invitation.save(
                  { integrate: inviteRequestJson.confirm.inviteConfirmation,
                    distribute: inviteRequestJson.confirm.addUserRequest,
                    transfer: inviteRequestJson.keys },
                  {
                    success: inviteConfirmedCb,
                    error: errorCb
                });
                
            });
            
          });
      
      });
    
    });
    
  },
  
  completeInviteRequest: function (groupId, invitationId, completeRequest, inviteCompletedCb, errorCb) {
    
    var _this = this;

    var invitation = new Invitation();
    invitation.set('id', invitationId);
    
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
  
  getAllGroupUpdates: function (updatedGroupsCb) {
    
    var url = SERVER_URL + '/users/' + this.get('id') + 
      '/invitations';
    
    var _this = this;
    
    var counter = 0;
    
    var updatedGroupsCbWrapper = function () {
      
      counter--;
      if (counter <= 0) updatedGroupsCb();
      
    };
    
    $.getJSON(url, function (groupUpdates) {
        
        counter = Object.keys(groupUpdates).length;

        if (counter == 0)
          updatedGroupsCbWrapper();
        
        _.each(groupUpdates, function (updates, groupId) {
          
          // Update the group member list.
          if (updates.members) {
            CurrentSession.setGroupMembers(updates.members); 
          }

          if (updates.integrate) {

            var invitationId = updates.integrate.id;
            var groupId = updates.integrate.group_id;
            var request = updates.integrate.request;
            var members = updates.members;

            if (updates.distribute) {

              _this.completeInviteRequest(groupId, invitationId, request, function () {
                  _this.addUsersRequest(updates.distribute,  updatedGroupsCbWrapper);
              });

            } else {

              _this.completeInviteRequest(groupId, invitationId, request, updatedGroupsCbWrapper);

            }

          } else if (updates.distribute) {

            _this.addUsersRequest(updates.distribute, updatedGroupsCbWrapper);

          } else {

            updatedGroupsCbWrapper();

          }
          
        });
        
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
    
    var userId = this.get('id');
    var url = SERVER_URL + '/users/' + userId;
    
    $.ajax(url, {
      
      type: 'GET',
      
      success: function (user) {
        
        CurrentSession.retrieveCredentials(function (credentials) {
          
          Crypto.initializeKeyfile(
            user.id, credentials.password,
            user.keyfile, refreshedKeyfileCb
          );
        
        });
        
    }});
    
  },
  
  userSaveError: function () {
    alert('Error while saving user!');
  }

});