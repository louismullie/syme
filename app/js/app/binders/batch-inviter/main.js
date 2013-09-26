Syme.Binders.add('batchinviter', { main: function() {

  $('#main').on('focusout', '#batchinvite #tags input', function() {

    var mail = this.value;

    if( $.ndbValidator.regexps.email.test(mail) ) {

      $(this).before('<span class="tag">'+ mail.toLowerCase() +'<span class="delete">×</span></span>');
      $(this).val('').removeClass('invalid');

    } else {

      $(this).addClass('invalid');

    }

  }).on('keyup', '#batchinvite #tags input', function(e) {

    // Enter, comma, tab
    if(/(13|188)/.test(e.which)) $(this).focusout();

  }).on('click','#batchinvite #tags .tag .delete', function(){

    $(this).parent().remove();

  });

}});