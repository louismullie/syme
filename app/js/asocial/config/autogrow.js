$.fn.autogrow = function(){

  this.filter('textarea').each(function() {
    
    var $this = $(this),

        minHeight = Math.abs($this.height()),

        shadow = $('<div></div>').css({
            position:       'absolute',
            top:            -10000,
            left:           -10000,
            width:          $(this).width(),
            fontSize:       $this.css('fontSize'),
            fontFamily:     $this.css('fontFamily'),
            lineHeight:     $this.css('lineHeight'),
            paddingTop:     $this.css('padding-top'),
            paddingBottom:  $this.css('padding-bottom'),
            borderTop:      $this.css('border-top'),
            borderBottom:   $this.css('border-bottom'),
            resize: 'none'
        }).addClass('shadow').appendTo(document.body),

        update = function(){
          var that = this;

          setTimeout(function(){
            var val = that.value
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/&/g, '&amp;')
              .replace(/\n/g, '<br/>&nbsp;');

            if ($.trim(val) === '') {
              val = 'a';
            }

            shadow.html(val);
            $(that).css('height', Math.max(shadow[0].offsetHeight, minHeight));
          }, 0);
        };

    $this.change(update).keyup(update).keydown(update).focus(update).on('paste', update);
    update.apply(this);
  });

  return this;
};