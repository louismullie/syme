Syme.Decryptor = {
  
  batchDecrypt: function(batchDecryptCallback, collection){

    var _this = this;
    
    // Defaults
    var batchDecryptCallback  = batchDecryptCallback || $.noop;
        collection            = collection ||
          $('[data-encrypted="true"]:not(#feed[data-single-post=""] .comment-box.collapsed)');


    // Asynchronous counter for decryption
    var decryptCounter = new Syme.Modules.Countable( collection,

      // Increment
      function(index, length) {
        // Prevent jumps in progress bar if multiple
        // batchDecrypt run at the same time
        if (NProgress.status < index / length)
          NProgress.set( index / length );
      },

      // Done
      function (elapsedTime) {
        console.log(elapsedTime / 1000);
        _this.formatPostsAndComments(collection, batchDecryptCallback);
      }

    );

    // Trigger decrypt on every element
    collection.trigger('decrypt', decryptCounter.increment);

  },
  
  formatPostsAndComments: function (collection, formattedCallback) {

    var $postsAndComments = collection.filter('.post, .comment-box');

    // Sync slave avatars
    $postsAndComments.find('.slave-avatar').trigger('sync');

    // Format textareas
    $postsAndComments.find('textarea').trigger('format');

    // Show posts and comments
    $postsAndComments.removeClass('hidden');

    $postsAndComments.find('.encrypted-image').trigger('decrypt');

    // Seem to sometimes fail accurate height
    // calculations in a seemingly non-deterministic way
    // Syme.Helpers.collapseHTML();

    // Callback for batchDecrypt
    (formattedCallback || $.noop)();

  }
  
};