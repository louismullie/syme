Syme.FeedScroller = function(){

  /* Configuration */

  var screenOffset = 50;

  /* Elements and initialization */

  var _this = this;
  this.loadedPages = 1;

  this.$window    = $(window),
  this.$document  = $(document),
  this.$feed      = $('#feed'),
  this.$loadMore  = $('#load-more');

  /* Constructor methods */

  this.scroll = function(){

    var withinLimits = ( _this.$window.scrollTop() >=
      _this.$document.height() - _this.$window.height() - screenOffset );

    if ( withinLimits && !_this.paused ) _this.trigger();

  };

  this.trigger = function(){

    _this.paused = true;
    _this.$loadMore.show();
    NProgress.showSpinner();

    var url = SERVER_URL + '/' + Syme.CurrentSession.getGroupId() + '/page';

    $.ajax( url, {
      type: 'POST',
      data: { page: ( _this.loadedPages + 1 ) },
      success: function(data){

        NProgress.hideSpinner();

        // Detach if there are no more pages to load
        if ( _.isEmpty(data) ) return _this.detach();

        var doneDecryptingCb = function(){

          _this.loadedPages++;
          _this.$loadMore.hide();
          _this.paused = false;

        };

        _this.render(data, doneDecryptingCb);

      }
    });

  };

  this.render = function(data, doneDecryptingCb) {

    var $collection = $();
    _.each(data.posts, function(post){
      $template   = $( Syme.Template.render('feed-post', post) )
      $collection = $collection.add( $template );
    });

    _this.$feed.append($collection);

    Syme.Decryptor.decryptPostsAndComments($collection, function(){

      // Because $collection contains only posts, we have to trigger
      // comment decryption manually.
      $collection.find('.comments').trigger('organize');

      doneDecryptingCb();

    });

  };

  this.detach = function(){

    _this.$window.off(_this.handler);
    _this.$loadMore.remove();

  };

  _this.$window.on('scroll', _this.scroll);

};