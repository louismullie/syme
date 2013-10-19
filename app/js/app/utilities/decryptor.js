Syme.Decryptor = {

  decryptPostsAndCommentsInContainer : function($container, decryptCallback) {

    var decryptCallback = decryptCallback || $.noop;

    // Default children to seek in the container
    var selector  = // Encrypted posts, and...
                    '.post[data-encrypted="true"], ' +
                    // encrypted comments excluding the collapsed ones, excepted in single post.
                    '.comment-box[data-encrypted="true"]:not(#feed[data-single-post=""] .collapsed)';

    var $collection = $container.find(selector);

    this.decryptPostsAndComments($collection, decryptCallback);

  },

  decryptPostsAndComments: function($collection, decryptCallback){

    var _this           = this,
        decryptCallback = decryptCallback || $.noop;

    // Asynchronous counter for decryption
    var decryptCounter = new Syme.Modules.Countable( $collection,

      // Increment
      function(index, length) {

        // Nasty hack to fix NProgress
        if (index == length) {
          NProgress.remove();
          NProgress.done();
        // Prevent jumps in progress bar if multiple
        // batchDecrypt run at the same time
        } else if (NProgress.status < index / length) {
          NProgress.set( index / length );
        }

      },

      // Done
      function (elapsedTime) {
        _this.formatPostsAndComments($collection, decryptCallback);
      }

    );

    // Trigger decrypt on every element
    $collection.trigger('decrypt', decryptCounter.increment);

  },

  formatPostsAndComments: function ($postsAndComments, formattedCallback) {

    // Note:
    // At this moment, Syme.Modules.Countable is not a reliable way
    // of deducing an ending time to the format chain, due to a non-deterministic
    // and timing-related issue. Calling the callback instantly is
    // way less dangerous, because decrypted elements will not show
    // until they are formatted anyways.

    // Wonder why, but proceeding like this shortens execution
    // time by ~8s on this particular function
    $postsAndComments.each(function(){ $(this).trigger('format', $.noop); });

    (formattedCallback || $.noop)();

  }

};