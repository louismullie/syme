Syme.Modal = {
 
  show: function(html, options) {

    var options  = typeof(options)          === "undefined" ? {} : options;

    // Options
    var closable = typeof(options.closable) === "undefined" ? true : options.closable;
    var classes  = typeof(options.classes)  === "undefined" ? '' : options.classes;

    // Callbacks
    var onshow   = typeof(options.onshow)   === "undefined" ? function(){} : options.onshow;
    var onhide   = typeof(options.onhide)   === "undefined" ? function(){} : options.onhide;
    var onsubmit = typeof(options.onsubmit) === "undefined" ? '' : options.onsubmit;

    // Kill previous modal if there is one
    $(document).off('keydown');
    $('#responsive-modal').remove();

    // Create modal
    $('body').prepend(
      '<div id="responsive-modal">' +
      '  <div class="container ' + classes + '" />' +
      '</div>'
    );

    // Bind close callbacks to modal
    $('#responsive-modal').data('onhide', onhide).data('onsubmit', onsubmit);

    // Fill modal with content
    $('#responsive-modal > div.container').html(html);

    // Additional closable events
    if(closable) {

      // Close on escape
      $(document).on('keydown', function(e){
        if ( e.which == 27 ) Syme.Modal.hide();
      });

      // Close on outside click
      $('#responsive-modal').click(function(){
        Syme.Modal.hide();
      });

      $('#responsive-modal div.container').click(function(e){
        e.stopPropagation();
      });

    }

    // Submit on enter key
    $(document).on('keydown', function(e){
      if ( e.which == 13 ) Syme.Modal.hide(true);
    });

    // Close on clicking a[role="close-modal"]
    $('#responsive-modal a[role="close-modal"]').click(function(e){
      e.preventDefault();
      if ( $(this).hasClass('disabled') ) return false;
      Syme.Modal.hide();
    });

    // Submit on clicking a[role="submit-modal"]
    $('#responsive-modal a[role="submit-modal"]').click(function(e){
      e.preventDefault();
      if ( $(this).hasClass('disabled') ) return false;
      Syme.Modal.hide(true);
    });

    // Submit on clicking a[role="submit-modal"]
    $('#responsive-modal a[role="submit"]').click(function(e){
      e.preventDefault();
      if ( $(this).hasClass('disabled') ) return false;
      $('#responsive-modal form').submit();
    });

    // Callback
    onshow();

    // Lock document and blur it
    $('body').addClass('noscroll modal-blur');
    document.ontouchmove = function(e) { e.preventDefault(); }

    // Show modal
    $('#responsive-modal').transition({ opacity: 1 }, 200);

    // Focus on first input[type="text"] or textarea
    $('#responsive-modal').find('input[type="text"], textarea').first().focus();
  },

  hide: function( submitted ) {

    // Callbacks
    if ( submitted && $('#responsive-modal').data('onsubmit') ) {
      // onsubmit()
      if($('#responsive-modal').data('onsubmit')()) return true;
    } else {
      // onhide()
      $('#responsive-modal').data('onhide')();
    }

    // Unbind remaining keydown events
    $(document).off('keydown');

    // Remove modal
    $('#responsive-modal').transition({ opacity: 0 }, 200);
    window.setTimeout(function(){ $('#responsive-modal').remove() }, 200);

    // Unlock document scroll
    $('body').removeClass('noscroll modal-blur');
    document.ontouchmove = function(e) { return true; }

  }
   
};