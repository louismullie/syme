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
 * must have a line-height style specified, and
 * both must have the same value. Also, the box-sizing (and
 * its browser-specific counterparts) should be set to 'border-box'
 */

$.fn.autogrow = function(){

  // Bind update function to all possible events
  // Note: the key to prevent flickering while keeping scrollbars
  // for max-height is to bind the update function to 'scroll'
  var handlers = 'focus keyup keydown scroll change cut paste';

  this.filter('textarea').each(function(){

    var $this = $(this);

    // Get sizes
    var lineHeight = parseInt($this.css('line-height'), 10) ||
      parseInt($this.css('font-size'), 10),
        padding = parseInt($this.css('padding-top'), 10) +
      parseInt($this.css('padding-bottom'), 10),
        border = parseInt($this.css('border-top-width'), 10) +
      parseInt($this.css('border-bottom-width'), 10);

    console.log($this, lineHeight, padding, border);

    // Bind handlers events to update action
    var update = function(){

      // Set height to 0 to calculate scrollHeight;
      // it should be too fast to produce flickering
      $this.height(0);

      // Calculate line count from scrollHeight,
      // padding and line-height
      var lines = Math.floor( ( $this[0].scrollHeight - padding ) / lineHeight );

      console.log('lines', lines);

      // Set the textarea to correct height
      $this.height(lines * lineHeight);

    };
    $this.bind(handlers, update);

    // Bind a 'autogrow.reset' event that clears
    // and resizes the textarea
    var reset = function() {
      $this.val(''); update();
    };
    $this.bind('autogrow.reset', reset);

    // Bind a 'autogrow.destroy' event that removes
    // the plugin's effect on the element
    var destroy = function(){
      $this.unbind(handlers, update)
           .unbind('autogrow.reset', reset)
           .unbind('autogrow.destroy', destroy);
    };
    $this.bind('autogrow.destroy', destroy);

  });

  // Chainability
  return this;

};