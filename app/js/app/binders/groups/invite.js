Syme.Binders.add('groups', { invite: function() {

  // Accept an invitation to join a group.
  $('#main').on('click', '.invite-link[data-invite-state="1"]', function (e) {
    e.preventDefault();
    if ($(this).data('disabled') == true) return;
    $(this).data('disabled', true);
    Invitation.acceptInvitationRequest($(this));
  });

  $('#main').on('click', 'a.fingerprint-link[data-toggler="true"]', function(e){

    var $fingerprintBox = $(this).closest('.group-card-content').find('.fingerprint-box'),
        show            = $fingerprintBox.hasClass('hidden');

    $(this)[show ? 'addClass' : 'removeClass']('expanded');
    $fingerprintBox[ show ? 'removeClass' : 'addClass' ]('hidden');

  });

  // View fingerprints for pending invitation
  $('#main').on('click', 'a.fingerprint-link[data-toggler!="true"]', function (e) {

    var $this           = $(this),
        $fingerprintBox = $this.closest('.group-card-content').find('.fingerprint-box'),
        $inviteLink     = $this.closest('.group-card').find('a.invite-link');

    var groupId   = $inviteLink.data('invite-group_id'),
        inviterId = $inviteLink.data('invite-inviter_id');

    var trimFingerprint = function(fullFingerprint) {
      return fullFingerprint.replace(/:/g, '').substr(0, 6);
    }

    Syme.Crypto.getKeyFingerprint(groupId, inviterId, 'invitee', null, function (fingerprint) {

      // Insert asynchronously gotten fingerprints
      $('.you', $fingerprintBox)
        .text(trimFingerprint(fingerprint.inviteeFingerprint))
        .attr('title', fingerprint.inviteeFingerprint);

      $('.inviter', $fingerprintBox)
        .text(trimFingerprint(fingerprint.inviterFingerprint))
        .attr('title', fingerprint.inviterFingerprint);

      // Make link a toggler and toggle it
      $this.attr('data-toggler', true).trigger('click');

    });

  });

} }); // Syme.Binders.add();