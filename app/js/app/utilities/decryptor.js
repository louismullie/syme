Syme.Decryptor = {

  decryptPostsAndComments: function($collection, batchDecryptCallback){

    var _this = this;

    // Defaults
    var $postsAndComments = $collection.find(
      '.post[data-encrypted="true"], .comment-box[data-encrypted="true"]');

    // $('[data-encrypted="true"]:not(#feed[data-single-post=""] .comment-box.collapsed)');

    // Asynchronous counter for decryption
    var decryptCounter = new Syme.Modules.Countable( $postsAndComments,

      // Increment
      function(index, length) {

        // Prevent jumps in progress bar if multiple
        // batchDecrypt run at the same time
        if (NProgress.status < index / length)
          NProgress.set( index / length );
      },

      // Done
      function (elapsedTime) {
        _this.formatPostsAndComments($postsAndComments, (batchDecryptCallback || $.noop));

      }

    );

    // Trigger decrypt on every element
    $postsAndComments.trigger('decrypt', decryptCounter.increment);

  },

  formatPostsAndComments: function ($postsAndComments, formattedCallback) {

    var formatCounter = new Syme.Modules.Countable(
      $postsAndComments, $.noop, ( formattedCallback || $.noop )
    );

    $postsAndComments.trigger('format', formatCounter.increment);

  }

};