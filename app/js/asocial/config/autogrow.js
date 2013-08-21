/*
 * Lightweight Textarea Autogrow
 * Version 1.0
 * Written by: Christophe Marois
 *
 * Using jQuery
 *
 * Instruction:
 * -------------
 * For the plugin to work accuratly, your textarea(s)
 * must have a height and a line-height style specified, and
 * both must have the same value. Also, the box-sizing (and
 * its browser-specific counterparts) should be set to its
 * default value, 'content-box'.
 */

$.fn.autogrow = function(){

  // Bind update function to all possible events
  // Note: the key to prevent flickering while keeping scrollbars
  // for max-height is to bind the update function to 'scroll'
  var handlers = 'focus keyup keydown scroll change cut paste';

  this.filter('textarea').each(function(){

    var $this = $(this);

    var lineHeight = parseInt($this.css('line-height'), 10) ||
      parseInt($this.css('font-size'), 10),
        padding = parseInt($this.css('padding-top'), 10) +
      parseInt($this.css('padding-bottom'), 10);

    var update = function(){

      // Set height to 0 to calculate scrollHeight;
      // this should not produce flickering
      $this.height(0);

      // Calculate line count from scrollHeight,
      // padding and line-height
      var lines = Math.floor( ( $this[0].scrollHeight - padding ) / lineHeight );

      // Set the textarea to correct height
      $this.css('height', lines * lineHeight);

    };

    // Bind handlers to update action
    $this.bind(handlers, update);

    // Bind a 'autogrow.reset' event that clears
    // and resizes the textarea
    $this.bind('autogrow.reset', function(){
      $this.val(''); update();
    });

    // Bind a 'autogrow.destroy' event that removes
    // the plugin's effect on the element
    $this.bind('autogrow.destroy', function(){
      $this.unbind(handlers + ' autogrow.reset autogrow.destroy', update);
    });

  });

  // Chainability
  return this;

};