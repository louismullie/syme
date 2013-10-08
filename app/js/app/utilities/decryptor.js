Syme.Decryptor = {

  decryptPostsAndCommentsInContainer : function($container, decryptCallback) {

    // Default children to seek in the container
    var selector  = // Encrypted posts, and...
                    '.post[data-encrypted="true"], ' +
                    // encrypted comments excluding the collapsed ones, excepted in single post.
                    '.comment-box[data-encrypted="true"]:not(#feed[data-single-post=""] .collapsed)';

    var $collection = $container.find(selector);

    this.decryptPostsAndComments($collection, decryptCallback);

  },

  decryptPostsAndComments: function($collection, decryptCallback){

    var _this = this;

    // Asynchronous counter for decryption
    var decryptCounter = new Syme.Modules.Countable( $collection,

      // Increment
      function(index, length) {

        // Prevent jumps in progress bar if multiple
        // batchDecrypt run at the same time
        if (NProgress.status < index / length)
          NProgress.set( index / length );
      },

      // Done
      function (elapsedTime) {
        _this.formatPostsAndComments($collection, (decryptCallback || $.noop));

      }

    );

    // Trigger decrypt on every element
    $collection.trigger('decrypt', decryptCounter.increment);

  },

  formatPostsAndComments: function ($postsAndComments, formattedCallback) {

    var formatCounter = new Syme.Modules.Countable(
      $postsAndComments, $.noop, ( formattedCallback || $.noop )
    );

    $postsAndComments.trigger('format', formatCounter.increment);

  }

};