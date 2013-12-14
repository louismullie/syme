// Our basic Todo model has text, order, and done attributes.
var User = Backbone.Model.extend({

  idAttribute: "id",
  url: SERVER_URL + '/users',

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
  
  deriveKeys: function (password, kdf, derivedKeysCb) {
    
    Syme.Crypto.generateRandomHex(128, function (salt) {
      
      // Derive authentication and keyfile encryption keys from password.
      Syme.Crypto.deriveKeys(password, salt, 512, kdf, function (keys) {

        derivedKeysCb({ authenticationKey: keys.key1, keyfileKey: keys.key2 }, salt);

      });
      
    })
    
  },
  
  createVerifier: function (email, authenticationKey, salt, save, verifierCreatedCb) {
    
    var srp = new SRPClient(email, authenticationKey, 2048, 'sha-256');
    
    // Calculate the SRP verifier and convert to hex.
    var verifierBn = srp.calculateV(salt);
    
    // Convert the SRP verifier to hexadecimal form.
    var verifierHex = verifierBn.toString(16);

    this.set('verifier', { content: verifierHex, salt: salt });
    
    if (!save) return verifierCreatedCb();
      
    this.save(null, { success: verifierCreatedCb, error: Syme.Router.error });

  },
  
  createKeyfile: function (password, keyfileCreatedCb) {

    var _this = this, email = this.get('email');

    Syme.Crypto.initializeKeyfile(email, password, null, function (encryptedKeyfile) {
      _this.updateKeyfile(encryptedKeyfile, keyfileCreatedCb);
    });

  },
  
  updateKeyfileKey: function (encryptionKey, keyfileCreatedCb) {
    
    var _this = this;
    
    Syme.Crypto.updateKeyfileKey(encryptionKey, function (encryptedKeyfile) {
      _this.updateKeyfile(encryptedKeyfile, keyfileCreatedCb);
    });
    
  },
  
  createKeylist: function (keylistId, keylistCreatedCb) {

    var _this = this;

    Syme.Crypto.createKeylist(keylistId, function (encryptedKeyfile) {
      _this.updateKeyfile(encryptedKeyfile, keylistCreatedCb);
    });

  },

  deleteKeylist: function (keylistId, keylistDeletedCb) {

    var _this = this;

    Syme.Crypto.deleteKeylist(keylistId, function (encryptedKeyfile) {
      _this.updateKeyfile(encryptedKeyfile, keylistDeletedCb);
    });

  },

  createInviteRequests: function (keylistId, emails, requestsCreatedCb) {

    var _this       = this;
    var invitation  = new Invitation();

    Syme.Crypto.createInviteRequests(keylistId, emails, function (inviteInfos) {

      Syme.Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {

        _this.updateKeyfile(encryptedKeyfile, function () {
          
          var keylistUrl = Syme.Url.fromGroup(keylistId);
          var createInviteUrl = Syme.Url.join(keylistUrl, 'invitations');
          
          $.ajax(createInviteUrl, {
            
            type: 'POST',
            data: { invitations: inviteInfos },
            success: requestsCreatedCb,
            
            error: function (response) {
              Syme.Error.ajaxError(response, 'create', 'invitations');
            }
            
          });

        });

      });

    });

  },

  acceptInviteRequest: function (invitationId, request, inviteAcceptedCb, errorCb) {

    var _this = this;
    var invitation = new Invitation();
    invitation.set('id', invitationId);
    
    if (!invitationId || !request)
      throw 'Empty invitation ID or request.';
  
    Syme.Crypto.acceptInviteRequest(request, function (inviteRequest) {

      Syme.Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {

        _this.updateKeyfile(encryptedKeyfile, function () {

          invitation.save(
            { accept: inviteRequest },
            {
              success: inviteAcceptedCb,
              error: function (error) {
                Alert.show("This invitation does not exist anymore.");
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

    var url = SERVER_URL + '/users/' + Syme.CurrentSession.getUserId() + '/groups/' + keylistId + '/keys';

    Syme.Crypto.confirmInviteRequest(keylistId, inviteeId, inviteRequest, function (inviteRequestJson) {

      if (inviteRequestJson.error)
        return errorCb();

      $.getJSON(url, function (keysJson) {

        Syme.Crypto.recryptKeys(keylistId, inviteeId, keysJson, function (recryptedKeys) {

          Syme.Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {

            _this.updateKeyfile(encryptedKeyfile, function () {

                invitation.save(
                  { integrate: inviteRequestJson.inviteConfirmation,
                    distribute: inviteRequestJson.addUserRequest,
                    transfer: recryptedKeys },
                  {
                    success: inviteConfirmedCb,
                    error: errorCb
                });

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

    Syme.Crypto.completeInviteRequest(completeRequest, function () { // This causes the error

        var acknowledgement = { invitation_id: invitationId };

        invitation.save(
          { completed: true },
          {
            success: function () {

              Syme.Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {

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

    Syme.Crypto.addUsersRequest(addUsersRequest, function (acknowledgements) {

      Syme.Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {

        _this.updateKeyfile(encryptedKeyfile, function () {

          _this.acknowledgeDistribute(acknowledgements, addedUsersCb);

        });

      });

    });

  },

  acknowledgeIntegrate: function(groupId, acknowledgement, acknowledgedCb) {

    var url = SERVER_URL + '/users/' + Syme.CurrentSession.getUserId() + '/groups/' +
              groupId + '/invitations/acknowledge';

    var data = { integrate: acknowledgement };

    $.ajax(url, { type: 'POST', data: data,

      success: acknowledgedCb,
      error: function () { alert('Integrate error!'); }

    });

  },

  acknowledgeDistribute: function (acknowledgements, acknowledgedCb) {

    var url = SERVER_URL + '/users/' + Syme.CurrentSession.getUserId() +
              '/invitations/acknowledge';

    var data = { distribute: acknowledgements };

    $.ajax(url, { type: 'POST', data: data,

      success: acknowledgedCb,
      error: function () { alert('Distribute error!'); }

    });

  },
  
  getGroupUpdates: function (groupId, updatedGroupCb) {
    
    var _this = this;
    
    var url = Syme.Url.join(Syme.Url.fromGroup(groupId), 'invitations');
    
    $.ajax(url, {
      
      success: function (updates) {
        _this.doGroupUpdates(updates, updatedGroupCb);
      },
      
      error: function () {
        alert('Could not get group updates.');
      }
      
    });
    
  },

  getAllGroupUpdates: function (updatedGroupsCb) {

    var url = SERVER_URL + '/users/' + this.get('id') + '/invitations';

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
          _this.doGroupUpdates(updates, updatedGroupsCbWrapper);
        });

    });

  },
  
  doGroupUpdates: function (updates, updatedGroupCb) {
    
    var _this = this;
    
    if (updates.members) {
      Syme.CurrentSession.setGroupMembers(updates.members);
    }

    if (updates.integrate) {

      var invitationId = updates.integrate.id;
      var groupId = updates.integrate.group_id;
      var request = updates.integrate.request;
      var members = updates.members;

      if (updates.distribute) {

        _this.completeInviteRequest(groupId, invitationId, request, function () {
            _this.addUsersRequest(updates.distribute,  updatedGroupCb);
        });

      } else {

        _this.completeInviteRequest(groupId, invitationId, request, updatedGroupCb);

      }

    } else if (updates.distribute) {

      _this.addUsersRequest(updates.distribute, updatedGroupCb);

    } else {

      updatedGroupCb();

    }
    
  },

  updateKeyfile: function (encryptedKeyfile, keyfileUpdatedCb) {

    var _this = this;

    this.set('keyfile', encryptedKeyfile);

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

        Syme.CurrentSession.retrieveCredentials(function (credentials) {

          Syme.Crypto.initializeKeyfile(
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