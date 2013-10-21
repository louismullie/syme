Syme.Decryptor = {

  decryptPostsAndComments: function($collection, finishedCb){

    var _this     = this;
    
    var decryptCb = function () {
      
      $collection.each(function (index, element) {
        _this.formatPostsAndComments(element, progressCb);
      });
      
      (finishedCb || $.noop)();
      
    };
    
    var index = 1, t = $collection.size();
    
    var progressCb = function(i){
      
      if (index == t) {
        NProgress.remove();
        NProgress.done();
        decryptCb();
      } else if (NProgress.status < index / t) {
        NProgress.set( index / t );
      }

      index++;
      
    };
    
    // Trigger decrypt on encrypted collection
    $collection.each(function (index, element) {
      _this._decryptPostsAndComments(element, progressCb)
    });
    
  },

  decryptPostsAndCommentsInContainer : function($container, decryptCb) {

    // Default children to seek in the container
    var selector  = // Encrypted posts, and...
                    '.post[data-encrypted="true"], ' +
                    // encrypted comments excluding the collapsed ones, excepted in single post.
                    '.comment-box[data-encrypted="true"]:not(#feed[data-single-post=""] .collapsed)';

    this.decryptPostsAndComments($container.find(selector), decryptCb);

  },
  
  _decryptPostsAndComments: function (element, decryptCb) {
    
    var decryptCb = decryptCb || $.noop;

    var $this = $(element);
    
    var groupId           = $this.closest('.post').data('group_id'),
        encryptedContent  = $this.attr('data-content'),
        $contentContainer = $this.find('.collapsable').first();

    var placeDecryptedContent = function(decryptedContent) {

      $this.attr('data-encrypted', false)
           .attr('data-content', decryptedContent);

      decryptCb($this);

    };

    try {

      Syme.Crypto.decryptMessage(groupId, encryptedContent, placeDecryptedContent);

    } catch(e) {

      var error = 'Decryption of post or comment failed';
      if(DEVELOPMENT) console.error(error);

      placeDecryptedContent(error);

    }
    
  },
  
  formatPostsAndComments: function (element) {
    
    var $this = $(element);
    
    var $collapsable    = $this.find('.collapsable').first(),
        content         = $this.attr('data-content');

    if ( $this.data('active') ) return; $this.data('active', true);

    $this
      .find('.slave-avatar').trigger('sync').end()
      .find('textarea').trigger('formatTextarea').end()
      .find('.encrypted-image').trigger('decrypt');

    // Create a jQuery wrapper around markdown'd text
    var $content = $( marked(content) );

    // Replace mentions
    $content.find('a[href^="id:"]').each(function(){

      // Get the part after the 'id:'
      var id = $(this).attr('href').split(':')[1];

      // Add class, remove link and add data
      $(this)
        .addClass('mentioned-user')
        .attr('href', '#')
        .attr('data-mentioned-user-id', id);

    });

    // Make sure external links open in new windows.
    $content.find('a:not([href="#"])').attr('target', '_blank');

    // Append the formatted content to collapsable
    $collapsable.append($content);

    // Format, clean container and display it
    $this
      .find('time.timeago').timeago().end()
      .oembed()
      .removeAttr('data-encrypted')
      .removeAttr('data-content')
      .removeClass('hidden');
    
  }

};