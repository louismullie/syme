function Uploader(file, options) {

  var _this = this;

  if (!file) {
    alert('Error: empty file, key or keys.')
  } else {
    this.file = file;
  }

  this.options = {}; options = options || {};

  this.options.data       = options.data       || {};
  this.options.baseUrl    = options.baseUrl    || '/file/';
  this.options.workerPath = options.workerPath || 'workers/';
  this.options.numWorkers = options.numWorkers || 4;
  this.options.chunkSize  = options.chunkSize  || 1 * 1024 * 1024;
  this.options.csrfToken  = options.csrfToken  || '';
  this.options.token      = options.token     || '';
  
  this.reader = new FileReader();
  this.workers = [];
  this.blob = null;
  this.numChunks = null;
  this.uploadId = null;
  this.uploadedChunks = 0;

  this.progress = this.options.progress;
  this.success = null;

  // FileReader events.
  this.reader.onload = function(event) {

     var text = event.target.result.split(',')[1];
     _this.blob = new Blob([text], { type: 'text/base64' });

     var chunkSize = _this.options.chunkSize;
     var numWorkers = _this.options.numWorkers;

     var numChunks = (_this.blob.size < chunkSize) ? 1 :
                     Math.ceil(_this.blob.size / chunkSize);

     _this.numChunks = numChunks;

     var activeWorkers = (numChunks < numWorkers) ?
                         numChunks : numWorkers;

     var numPasses = (numChunks <= activeWorkers) ? 1 :
                     Math.ceil(numChunks / activeWorkers);

    _this.numPasses = numPasses;

    var passes = [];
    var currentWorkers = activeWorkers;
    
    for (pass = 0; pass < numPasses; pass += 1) {

       if (pass == numPasses - 1) {
          currentWorkers = (numChunks % activeWorkers) != 0 ?
          numChunks % activeWorkers : currentWorkers;
       } else {
          currentWorkers = activeWorkers;
       }

       var chunks = [];

       for (worker = 0; worker < currentWorkers; worker += 1) {

         var start = pass * activeWorkers * chunkSize +
                     worker * chunkSize;

         var end = (start + chunkSize > _this.blob.size) ?
             _this.blob.size : start + chunkSize;
             
         chunks.push([start, end]);
       }

       passes.push(chunks);

     }
     
     _this.passes = passes;

     _this.firstPass();

  };

  this.callback = function(msg) {

    var _this = this;

    if(msg.data['status'] == 'ok') {

      _this.uploadedChunks += 1;
      _this.progress(_this.uploadedChunks / _this.numChunks * 100);

      if (_this.uploadedChunks == _this.numChunks) {
        
        _this.success(_this.uploadId);
      }

      var pass = msg.data['pass'];
      var worker = msg.data['worker'];

      _this.nextChunk(pass + 1, worker);

    } else {

      Alert.show('Bungee error.');

    }
  };

  this.start = function(progress, success) {

    var _this = this;

    this.progress = progress;
    this.success = success;

    if (!window.uploadWorkerPool) {
      window.uploadWorkerPool = new WorkerPool(
        this.options.workerPath + 'encrypt.js',
        this.options.numWorkers, this.callback
      );
    }

    this.workerPool = window.uploadWorkerPool;

    var url = this.options.baseUrl + 'upload/create';
    var xhr = new XMLHttpRequest();
    
    xhr.addEventListener("error", function(evt) {
      throw "Error: can't start upload.";
    }, false);

    xhr.addEventListener("abort", function(evt) {
      throw "Abort: can't start upload.";
    }, false);

    xhr.addEventListener("load", function(event) {

      var data = JSON.parse(event.target.responseText);
      _this.uploadId = data.upload.id;
      _this.reader.readAsDataURL(_this.file);

    });

    Syme.Crypto.generateRandomKeys(function (key) {
      
      _this.key = key;

      if (!key) throw 'Illegal - no key given.';
      
      var keylistId = Syme.CurrentSession.getGroupId(); // unsafe!
      
      Syme.Crypto.encryptMessage(keylistId, key, function (encryptedMessage) {
        
        var fd = new FormData();
        
        fd.append('type', _this.file.type);
        fd.append('size', _this.file.size);
        fd.append('filename', _this.file.name);
        fd.append('keys', encryptedMessage);
        
        var data = _this.options.data;

        for (key in data) {
          fd.append(key, data[key].toString());
        }
        
        xhr.open('POST', _this.options.baseUrl + 'upload/create');
        xhr.setRequestHeader('X_CSRF_TOKEN', _this.options.csrfToken);
        xhr.setRequestHeader('AccessToken', _this.options.token);

        xhr.send(fd);
        
      });

    });
    
  };

  this.firstPass = function() {

    var length = this.passes[0].length;

    for (j = 0; j < length; j += 1) {
      this.nextChunk(0, j);
    }

  };

  this.nextChunk = function (pass, worker) {

    if (!this.passes[pass] || !this.passes[pass][worker])
      return;

    var slice = this.passes[pass][worker];

    var start = slice[0]; var end = slice[1];
    
    this.sendChunk(pass, worker, start, end);

  };

  this.sendChunk = function(pass, worker, start, end) {

    var chunk = this.blob.slice(start, end);

    var data = { chunk: chunk, key: this.key };

    var appendUrl = this.options.baseUrl + 'upload/append';

    this.workerPool.queueJob({
      pass: pass, worker: worker,
      data: data, id: this.uploadId,
      url: appendUrl, chunks: _this.numChunks,
      csrf: this.options.csrfToken,
      token: this.options.token
    }, this);

    chunk = null;

  };

  this.str2ab = function(str) {

    var buf = new ArrayBuffer(str.length*2);

    var bufView = new Uint16Array(buf);

    for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }

    return buf;

  };

};
