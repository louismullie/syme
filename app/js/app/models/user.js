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
  createKeyfile: function (password, keyfileCreatedCb) {

    var _this = this, email = this.get('email');

    Syme.Crypto.initializeKeyfile(email, password, null, function (encryptedKeyfile) {
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

  createInviteRequests: function (keylistId, emails, requestSentCb) {

    var _this       = this;
    var invitation  = new Invitation();

    Syme.Crypto.createInviteRequests(keylistId, emails, function (inviteInfos) {

      Syme.Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {

        _this.updateKeyfile(encryptedKeyfile, function () {

          _.each(inviteInfos, function (inviteInfo, index) {

            var email         = inviteInfo.alias,
                inviteRequest = inviteInfo.request;

            invitation.save(
              {
                group_id: keylistId,
                email: email,
                request: inviteRequest
              },
              {
                success: requestSentCb,

                error: function (model, response) {
                  var responseJson = JSON.parse(response.responseText);
                  inviteInfos[index].error = responseJson.error;
                  requestSentCb();
                }
              }
            );

          });

        });

      });

    });

  },

  acceptInviteRequest: function (invitationId, request, inviteAcceptedCb, errorCb) {

    var _this = this;
    var invitation = new Invitation();
    invitation.set('id', invitationId);

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

    $.getJSON(url, function (keysJson) {

      Syme.Crypto.confirmInviteRequest(keylistId, inviteeId, inviteRequest, keysJson, function (inviteRequestJson) {

          if (inviteRequestJson.error)
            return errorCb();

          Syme.Crypto.getEncryptedKeyfile(function (encryptedKeyfile) {

            _this.updateKeyfile(encryptedKeyfile, function () {

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
            Syme.CurrentSession.setGroupMembers(updates.members);
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