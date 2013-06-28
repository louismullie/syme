Crypto = function (workerUrl) {
  
  var callback = function (result) {

    var message = result.data;

    if (message.status == 'error') throw message.error

    if (!message.callback) return;
      
    var callback = message.callback.split('.');
    var currentFunction = this;

    _.each(callback, function (piece) {
      currentFunction = currentFunction[piece];
    });

    currentFunction(message.result);

  };
  
  this.debug = function (result) {
    console.log(result);
  };
  
  this.workerPool = new WorkerPool(workerUrl, 4, callback);
  
};

Crypto = new Crypto('js/asocial/workers/crypto.js');

var array = new Uint32Array(32);
window.crypto.getRandomValues(array);
array = _.map(array, function (i) { return i });

Crypto.workerPool.queueJob({ method: 'seedRandom', params: [array] });
