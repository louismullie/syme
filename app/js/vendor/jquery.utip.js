$.fn.utip = function() {

  var gravities = function(elO, elD, utD) {

    var axes = {
      h: {
        l: elO.left - utD.width,
        w: elO.left - utD.width + elD.width / 2,
        c: elO.left - utD.width / 2 + elD.width / 2,
        e: elO.left + elD.width / 2,
        r: elO.left + elD.width,
      },

      v: {
        n: elO.top - utD.height,
        c: elO.top - utD.height / 2 + elD.height / 2,
        s: elO.top + elD.height
      }
    };

    return {
      nw: { top: axes.v.n, left: axes.h.w },
      n:  { top: axes.v.n, left: axes.h.c },
      ne: { top: axes.v.n, left: axes.h.e },
      e:  { top: axes.v.c, left: axes.h.r },
      se: { top: axes.v.s, left: axes.h.e },
      s:  { top: axes.v.s, left: axes.h.c },
      sw: { top: axes.v.s, left: axes.h.w },
      w:  { top: axes.v.c, left: axes.h.l }
    };

  };

  this.on('mouseenter', function(e){

    var $this = $(this);

    // Remove previous utips left by hoverTimer
    $('#utip').remove();

    // Get data attributes
    var content = $this.attr('data-utip'),
        gravity = $this.attr('data-utip-gravity');

    // Create utip element and add it to body
    var $utip = $('<div id="utip" />').attr('data-gravity', gravity).html(content);
    $('body').prepend($utip);

    // Calculate dimensions
    var elOffset        = $this.offset(),
        elDimensions    = { width: $this.outerWidth(), height: $this.outerHeight() },
        utipDimensions  = { width: $utip.outerWidth(), height: $utip.outerHeight() };

    // Calculate tooltip position according to gravity
    var utipOffset = gravities(elOffset, elDimensions, utipDimensions)[gravity];
    $utip.css(utipOffset);

    // Bind removal on mouseleave
    var hoverTimer;
    $this.add($utip).hover(function(){
      if (hoverTimer) clearTimeout(hoverTimer);
    }, function(){
      hoverTimer = setTimeout(function(){ $utip.remove(); }, 100);
    });

  });

  // Chainability
  return this;

};