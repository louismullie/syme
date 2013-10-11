Syme.Binders.add('batchinviter', { main: function() {

  var currentUserEmail = Syme.CurrentSession.getUser().get('email');

  // Batch email text input

  $('#main, #responsive-modal').on('changeState', '#batchinvite a#batchinvite-link', function(e){

    var enable = $('#batchinvite #tags .tag').length > 0;
    $(this)[enable ? 'removeClass' : 'addClass']('empty');
    $('#batchinvite input')[enable ? 'addClass' : 'removeClass']('no-placeholder');

  });

  $('#batchinvite').on('focusout', '#tags input', function() {

    // Return if batchinviter is active
    if( !!$('#batchinvite').attr('data-active') ) return;

    var userEmails = $('ul#userlist li').map(function () {
      return $(this).attr('data-email');
    });
    
    var mail = this.value.toLowerCase().replace(/(\s+|,|;)/g, '');

    if ( mail == '' ) return $(this).removeClass('invalid');

    // Conditions: must be a valid email, must be different from
    // current user's email, and must not be already entered.
    var is_valid        = $.ndbValidator.regexps.email.test(mail),
        is_not_current  = mail != currentUserEmail,
        is_new          = $('span.tag[data-mail="' + mail + '"]').length == 0,
        is_not_already_invited = !_.contains(userEmails, mail);

    if( is_valid && is_not_current && is_new && is_not_already_invited ){

      $(this).before('<span class="tag" data-mail="' + mail + '">'+ mail +'<span class="delete">×</span></span>');
      $(this).val('').parent().removeClass('invalid');

      $(this).focus();

      $('#batchinvite a#batchinvite-link').bind('click', function(){ return false; });
      window.setTimeout(function(){ $('#batchinvite a#batchinvite-link').unbind('click') }, 500);

      $('#batchinvite a#batchinvite-link').trigger('changeState');

    } else {

      $(this).parent().addClass('invalid');

    }

  }).on('keyup', '#tags input', function(e) {

    // Enter, space, comma, semicolumn
    if(/(13|32|188|186)/.test(e.which)) $(this).focusout();

  }).on('click', '.tag .delete', function(e){

    e.stopPropagation();

    // Return if batchinviter is active
    if( !!$('#batchinvite').attr('data-active') ) return;

    $(this).parent().remove();

    $('#batchinvite a#batchinvite-link').trigger('changeState');

  }).on('click', '#tags', function(e) {

    $(this).find('input').focus();

  });

  $('#main, #responsive-modal').on('click', 'a#batchinvite-link', function(e){

    var $this         = $(this),
        $batchinvite  = $('#batchinvite'),
        $input        = $('input', $batchinvite);

    // Return if button is disabled or the batchinviter is active
    if( $this.hasClass('empty') || !!$batchinvite.attr('data-active') ) return;

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
  window.setTimeout(function(){ $('#batchinvite input').focus() }, 100);

}});