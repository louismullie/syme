$.fn.highlight = function(bgcolor, opacity) {
  if(typeof(bgcolor)==='undefined') bgcolor = "#ffff99";
  if(typeof(opacity)==='undefined') opacity = ".5";
  $(this).each(function () {
    var el = $(this);
    $("<div/>")
    .width(el.outerWidth())
    .height(el.outerHeight())
    .css({
      "position": "absolute",
      "left": el.offset().left,
      "top": el.offset().top,
      "background-color": bgcolor,
      "opacity": opacity,
      "z-index": "9999999"
    }).appendTo('body').fadeOut(1000)
    .queue(function () { $(this).remove(); });
  });
};