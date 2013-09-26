Syme.Binders.add('batchinviter', { main: function() {

  // Batch email text input. Get array of results like this:
  // $('span.tag[data-mail]').map(function(tag){ return $(this).attr('data-mail') });

  $('#main').on('changeState', '#batchinvite a#batchinvite-link', function(){
    var action = $('#batchinvite #tags .tag').length > 0 ? 'removeClass' : 'addClass';
    $(this)[action]('disabled');
  });

  $('#main').on('focusout', '#batchinvite #tags input', function() {

    var mail = this.value.toLowerCase();

    if ( mail == '' ) return $(this).removeClass('invalid');

    if( $.ndbValidator.regexps.email.test(mail) ) {

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

    $(this).parent().remove();

    $('#batchinvite a#batchinvite-link').trigger('changeState');

  });

  // Focus on pageload
  $('#batchinvite input')[0].focus();

}});