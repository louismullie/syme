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

    Syme.Crypto.getKeyFingerprint(groupId, inviterId, 'invitee', null, function (fingerprints) {

      // Insert asynchronously gotten fingerprints
      $('.you', $fingerprintBox)
        .text(Syme.Helpers.shortenFingerprint(fingerprints.inviteeFingerprint))
        .attr('title', fingerprints.inviteeFingerprint);

      $('.inviter', $fingerprintBox)
        .text(Syme.Helpers.shortenFingerprint(fingerprints.inviterFingerprint))
        .attr('title', fingerprints.inviterFingerprint);

      // Make link a toggler and toggle it
      $this.attr('data-toggler', true).trigger('click');

    });

  });

} }); // Syme.Binders.add();