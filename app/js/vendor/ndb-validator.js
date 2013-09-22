// No-damn-bullshit validator
//
// $(form).ndbValidator({
//   showErrors: function (input, errors) {},
//   hideErrors: function (input) {}
// });

(function($) {

  // Create namespace.
  if (!$.ndbValidator) $.ndbValidator = {};

  // Binding function
  $.fn.ndbValidator = function (params) {

    var showErrors = params.showErrors || function(){};
    var hideErrors = params.hideErrors || function(){};

    return this.each(function() {

      var $form = $(this);

      $form
        // Prevent HTML5 validation
        .attr('novalidate', 'novalidate')

        // Bind submit function
        .submit(function(e) {

          // Prevent form from submitting
          e.preventDefault(); e.stopPropagation();

          // Run validation over every element
          $form.find('input').each(function(){
            $.ndbValidator.validateInput(this, showErrors, hideErrors);
          });

          // Check if there are validation errors
          var errorsFound = false;
          $form.find('input').not('[type="submit"]').each(function(){
            if( $(this).data('validation-error') ) errorsFound = true;
          });

          if ( errorsFound ) {

            // It there has been errors, trigger error messages
            $form.data('submit-failed', true);

            // Run validation over every element
            $form.find('input').each(function(){
              $.ndbValidator.validateInput(this, showErrors, hideErrors);
            });

          } else {

            // Unbind this event
            $form.unbind(e);

            // Submit form
            return $form.submit();

          }

        })

        // Iterate through every input
        .find('input')
          // Mark all fields as erroneous at first
          .data('validation-error', true)

          // Bind events
          .keyup(function(){ $.ndbValidator
            .validateInput(this, showErrors, hideErrors); })
          .focusout(function(){ $.ndbValidator
            .validateInput(this, showErrors, hideErrors); });

    });

  };

  // Validating function
  $.ndbValidator.validateInput = function(element, showErrors, hideErrors){

    // Get input and value
    var $input = $(element);
    var val = $input.val();

    // Shortcuts for attributes
    var regexp        = $input.attr('pattern'),
        required      = $input.attr('required'),
        minlength     = $input.attr('minlength'),
        email         = $input.data('validate-email'),
        equals_to     = $input.data('validate-equals-to'),
        differs_from  = $input.data('validate-differs-from');

    // Error definitions (in order of importance)
    var errors = {
      regexp:       !!regexp        && !regexp.test(val),
      required:     !!required      && val.length <= 0,
      minlength:    !!minlength     && val.length < parseInt(minlength, 0),
      email:        !!email         && !$.ndbValidator.regexps.email.test(val),
      equals_to:    !!equals_to     && val != $('input[name="' + equals_to + '"]').val(),
      differs_from: !!differs_from  && val == differsFromSelector(differs_from).val(),
    };

    // Optional password strength check with zxcvbn
    if(typeof zxcvbn === 'function') {
      var password_strength = $input.data('validate-password-strength');
      errors['password_strength'] = !!password_strength && zxcvbn(val).score < password_strength;
    }

    // Check for errors in inputs rules
    var key, errorCatched;
    for(key in errors){
      if(errors[key]) errorCatched = true;
    }

    if (errorCatched) {

      // Make an array of errors
      var errorArray = [];
      for( var key in errors ) { if(errors[key]) errorArray.push(key); }

      // Show error on element
      showErrors($input, errorArray);
      $input.data('validation-error', true);

    } else {

       // Remove error on element
       if ($input.data('validation-error')){
          hideErrors($input);
          $input.data('validation-error', false);
       }

    }

  };

  // Regxeps
  $.ndbValidator.regexps = {
    // by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
    email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
  };

  // Differs from rule helper. Takes a string
  // rule 'name, email' and converts it to jquery
  // selector $('input[name="name"], input[name="email"]')
  var differsFromSelector = function(attribute){

    var selector = [];

    // Remove whitespace and split with commas
    attribute = attribute.replace(/\s/g, '').split(',');

    $.each(attribute, function(i, element){
      selector.push('input[name="' + element + '"]');
    });

    return $(selector.join(','));

  };

})($);