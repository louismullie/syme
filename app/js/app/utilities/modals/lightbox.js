Lightbox = {

  show: function(url) {

    // Url is required to proceed
    if ( typeof(url) === "undefined" ) return false;

    var template = Syme.Template.render('feed-modals-lightbox', { url: url });

    Modal.show(template, {
      classes: 'modal-lightbox',

      onshow: function() {
        $().binders['modals']['lightbox']();
      }
    });

  }
  
};