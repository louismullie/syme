Syme.Binders.add('feed', { scroller: function(){

  $('#feed').prop('scroller', {

    /* Configuration */

    offset: 50,

    /* Elements */

    $window:    $(window),
    $document:  $(document),
    $feed:      $('#feed'),
    $loadMore:  $('#load-more'),

    /* Methods */

    handler: (function(self){

      var _this = self;

      return _this.$window.on('scroll feedScroller.trigger', function(){

        var withinLimits = ( _this.$window.scrollTop() >=
          _this.$document.height() - _this.$window.height() - this.offset );

        if ( withinLimits && _this.loadedPages && !_this.paused )
          _this.trigger();

      });

    })(this),

    trigger: function(){

      var _this = this;

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

    },

    render: function(data, doneDecryptingCb) {

      var _this = this;

      var $collection = $();
      _.each(data.posts, function(post){
        $collection = $collection.add(
          $( Syme.Template.render('feed-post', post) );
        );
      });

      _this.$feed.append($collection);
      Syme.Decryptor.decryptPostsAndComments($collection, doneDecryptingCb);

    },

    detach: function(){

      var _this = this;

      _this.$window.off(this.handler);
      _this.$loadMore.remove();

    }

  });

  // Load more button
  $('#main').on('click', '#load-more a', function(e){
    $(this).parent().fadeOut('fast');
    $(window).trigger('infinitescroll.trigger');
  });

} }); // Syme.Binders.add();