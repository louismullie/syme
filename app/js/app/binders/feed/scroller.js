Syme.Binders.add('feed', { scroller: function(){

  var Scroller = function(){

    var _this = this;

    /* Configuration */

    var screenOffset = 50;

    /* Elements */

    this.$window    = $(window),
    this.$document  = $(document),
    this.$feed      = $('#feed'),
    this.$loadMore  = $('#load-more');

    /* Constructor methods */

    this.scroll = function(){

      var withinLimits = ( _this.$window.scrollTop() >=
        _this.$document.height() - _this.$window.height() - screenOffset );

      if ( withinLimits && _this.loadedPages && !_this.paused )
        _this.trigger();

    };

    this.trigger = function(){

      _this.paused = true;
      _this.$loadMore.show();
      NProgress.showSpinner();

      var url = SERVER_URL + '/' + Syme.CurrentSession.getGroupId() + '/page';

      $.post( url, { page: ( _this.loadedPages + 1 ) }, function(data){

        NProgress.hideSpinner();

        // Detach if there are no more pages to load
        if ( _.isEmpty(data) ) _this.detach();

        var doneDecryptingCb = function(){

          _this.loadedPages++;
          _this.$loadMore.hide();
          _this.paused = false;

        };

        _this.render(data, doneDecryptingCb);

      });

    };

    this.render = function(data, doneDecryptingCb) {

      var $collection = $();
      _.each(data.posts, function(post){
        $template   = $( Syme.Template.render('feed-post', post) )
        $collection = $collection.add( $template );
      });

      _this.$feed.append($collection);

      Syme.Decryptor.decryptPostsAndComments($collection, doneDecryptingCb);

    };

    this.detach = function(){

      _this.$window.off(_this.handler);
      _this.$loadMore.remove();

    };

    _this.$window.on('scroll', _this.scroll);

  };

  // Create a new scroller as a #feed DOM property
  $('#feed').prop('scroller', new Scroller);

} }); // Syme.Binders.add();