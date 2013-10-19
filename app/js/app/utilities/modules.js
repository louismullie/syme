Syme.Modules = {};

Syme.Modules.Countable = function (collection, incrementCallback, doneCallback) {

  var decryptCounter    = 0,
      startTime         = new Date,
      collectionLength  = collection.length;

  if (!collectionLength) doneCallback( false );

  this.increment = function() {

    // Increment counter
    decryptCounter++;

    // Call incrementCallback
    if ( decryptCounter <= collectionLength)
      incrementCallback(decryptCounter, collectionLength);

    // Call done if all elements are done
    if( decryptCounter == collectionLength ){

      var endTime     = new Date,
          elapsedTime = endTime - startTime;

      doneCallback(elapsedTime);

    }

  }

};