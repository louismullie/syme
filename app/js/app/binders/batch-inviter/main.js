Syme.Binders.add('batchinviter', { main: function() {

  var currentUserEmail = Syme.CurrentSession.getUser().get('email');

  // Batch email text input

  $('#main').on('changeState', '#batchinvite a#batchinvite-link', function(){
    var action = $('#batchinvite #tags .tag').length > 0 ? 'removeClass' : 'addClass';
    $(this)[action]('disabled');
  });

  $('#main').on('focusout', '#batchinvite #tags input', function() {

    // Return if batchinviter is active
    if( !!$('#batchinvite').attr('data-active') ) return;

    var mail = this.value.toLowerCase();

    if ( mail == '' ) return $(this).removeClass('invalid');

    // Conditions: must be a valid email, must be different from
    // current user's email, and must not be already entered.
    var is_valid        = $.ndbValidator.regexps.email.test(mail),
        is_not_current  = mail != currentUserEmail,
        is_new          = $('span.tag[data-mail="' + mail + '"]').length == 0;

    if( is_valid && is_not_current && is_new ){

      $(this).before('<span class="tag" data-mail="' + mail + '">'+ mail +'<span class="delete">×</span></span>');
      $(this).val('').removeClass('invalid');

      $(this).focus();

      $('#batchinvite a#batchinvite-link').trigger('changeState');

    } else {

      $(this).addClass('invalid');

    }

  }).on('keyup', '#batchinvite #tags input', function(e) {

    // Enter, comma, tab
    if(/(13|188)/.test(e.which)) $(this).focusout();

  }).on('click','#batchinvite #tags .tag .delete', function(){

    // Return if batchinviter is active
    if( !!$('#batchinvite').attr('data-active') ) return;

    $(this).parent().remove();

    $('#batchinvite a#batchinvite-link').trigger('changeState');

  });

  $('#main').on('click', 'a#batchinvite-link', function(e){

    var $this         = $(this),
        $batchinvite  = $('#batchinvite'),
        $input        = $('input', $batchinvite);

    // Return if button is disabled or the batchinviter is active
    if( $this.hasClass('disabled') || !!$batchinvite.attr('data-active') ) return;

    // Mark the batchinviter as active
    $batchinvite.attr('data-active', true);
    $input.prop('disabled', true);

    // Get emails in this format: [*str email]
    var emails = $('#batchinvite span.tag[data-mail]').map(function(){
      return $(this).attr('data-mail');
    }).get();

    var user    = Syme.CurrentSession.getUser(),
        groupId = Syme.CurrentSession.getGroupId();

    user.createInviteRequests(groupId, emails, function(){
      
      var groupRoute = Syme.Url.join('users',
        user.get('id'), 'groups', groupId);
      
      Syme.Router.navigate(groupRoute);
      
    });

  });

  // Focus on pageload
  $('#batchinvite input')[0].focus();

}});