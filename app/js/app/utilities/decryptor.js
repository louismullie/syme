Syme.Decryptor = {

  decryptPostsAndComments: function($collection, decryptCb){

    var _this     = this,
        decryptCb = decryptCb || $.noop;

    // Trigger decrypt on encrypted collection
    $collection.chainTrigger('decrypt', function(i, t){

      if (i == t) {
        NProgress.remove();
        NProgress.done();
      } else if (NProgress.status < i / t) {
        NProgress.set( i / t );
      }

    }, function(){

      // Trigger format on decrypted collection, then callback
      $collection.chainTrigger('format', $.noop, decryptCb);

    });

  },

  decryptPostsAndCommentsInContainer : function($container, decryptCb) {

    // Default children to seek in the container
    var selector  = // Encrypted posts, and...
                    '.post[data-encrypted="true"], ' +
                    // encrypted comments excluding the collapsed ones, excepted in single post.
                    '.comment-box[data-encrypted="true"]:not(#feed[data-single-post=""] .collapsed)';

    this.decryptPostsAndComments($container.find(selector), decryptCb);

  }

};