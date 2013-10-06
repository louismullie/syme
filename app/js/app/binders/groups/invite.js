Syme.Binders.add('groups', { invite: function() {

  var MyView = Backbone.View.extend({
    
    events: {
      'click a.invite-link[data-invite-state="1"]' : 'acceptInvitation',
      'click a.fingerprint-link[data-toggler="true"]' : 'toggleFingeprint',
      'click a.fingerprint-link[data-toggler!="true"]': 'showFingeprint'
    },
    
    initialize: function(){
      _.bindAll(this, 'render');
    },
    
    render: function () {
      return this;
    },
    
    acceptInvitation: function(e){
      
      var $this = $(e.target);
      e.preventDefault();
      
      if ($this.data('disabled') == true) return;
      $this.data('disabled', true);
      
      Invitation.acceptInvitationRequest($this.closest('.invite-link'));
      
    },
    
    toggleFingerprint: function (e) {
      
      alert('fdf');
      var $this = $(e.target);
      
      var $fingerprintBox = $this.closest('.group-card-content').find('.fingerprint-box'),
          show            = $fingerprintBox.hasClass('hidden');

      $this[show ? 'addClass' : 'removeClass']('expanded');
      $fingerprintBox[ show ? 'removeClass' : 'addClass' ]('hidden');

    },
    
    showFingerprint: function (e) {
      
      alert('fdf');
      var $this = $(e.target);
      
      var $fingerprintBox = $this.closest('.group-card-content').find('.fingerprint-box'),
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
      
    }
    
  });
  
  MyView2 = new MyView({ el: $('#main') });

} }); // Syme.Binders.add();