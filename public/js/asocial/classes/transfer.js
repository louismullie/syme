function WorkerPool(url, size, callback) {
  
    this.url = url;
    this.size = size;
    
    this.callback = callback;
    this.contexts = {};
    
    this.jobs = [];
    this.pending = [];
    this.workers = [];
    this.active = 0;
    
    for(i = 0; i < this.size; i++) {
      this.pending[i] = 0;
    }
    
    this.createWorkers = function () {
      
      var _this = this;

      for (var n = 0; n < this.size; n += 1) {
        
        var worker = new Worker(this.url);
        
        worker.onmessage = function (msg) {
          
          var context = _this.contexts[msg.data.id];
          _this.callback.call(context, msg);
          _this.active--;
          _this.nextJob();
          
        };
        
        this.workers.push(worker);

      }

    };
    
    this.createWorkers();
    
    console.log(this.workers);
    
    this.queueJob = function(job, context) {
      
      this.jobs.push(job);
      this.contexts[job.id] = context;
      
      if (this.active < this.size) {
        this.nextJob();
      }
        
    };
    
    this.nextJob = function() {
      
      var minValue = 0, minIndex = 0;
      
      // Find worker with smallest queue.
      for (var i = 0; i < this.size; i++) {
        
        if (this.pending[i] <= minValue) {
          minValue = this.pending[i];
          minIndex = i;
        }
        
      }
      
      var job = this.jobs.pop();
      
      if (job) {
        this.active++;
        this.workers[minIndex].postMessage(job);
      }
      
      
    };

}

function Uploader(file, key, keys, options) {
  
  var _this = this;
  
  if (!file || !key ||!keys) {
    alert('Error: empty file, key or keys.')
  } else {
    this.file = file;
    this.key = key;
    this.keys = keys;
  }
  
  this.options = {}; options = options || {};
  
  this.options.key        = options.key;
  this.options.data       = options.data       || {};
  this.options.baseUrl    = options.baseUrl    || '/file/';
  this.options.workerPath = options.workerPath || '/js/asocial/workers/';
  this.options.numWorkers = options.numWorkers || 4;
  this.options.chunkSize  = options.chunkSize  ||
                            0.8 * 1024 * 1024;
  
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

    console.log("File size: " + _this.blob.size);
    console.log("Number of chunks: " + numChunks);
    console.log("Number of passes: " + numPasses);
    console.log("Active workers: " + activeWorkers);
     
    var passes = [];
    var currentWorkers = activeWorkers;
    
    for (pass = 0; pass < numPasses; pass += 1) {
         
       if (pass == numPasses - 1) {
          currentWorkers = (numChunks % activeWorkers) != 0 ?
          numChunks % activeWorkers : currentWorkers;
       } else {
          currentWorkers = activeWorkers;   
       }
       
       console.log("Pass #" + pass + ", " +
       currentWorkers + " using workers.");
         
       var chunks = [];
     
       for (worker = 0; worker < currentWorkers; worker += 1) {
         
         var start = pass * activeWorkers * chunkSize +
                     worker * chunkSize;
         
         var end = (start + chunkSize > _this.blob.size) ? 
             _this.blob.size : start + chunkSize;
           
         console.log("Chunk " + pass + "." +
         worker + ": [" + start + ", " + end + "]");

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

      console.log("Uploaded " + _this.uploadedChunks +
                  "/" + _this.numChunks + " chunks");

      _this.progress(_this.uploadedChunks / _this.numChunks * 100);

      if (_this.uploadedChunks == _this.numChunks) {
        _this.success(_this.uploadId);
      }

      var pass = msg.data['pass'];
      var worker = msg.data['worker'];

      _this.nextChunk(pass + 1, worker);

    } else {

      alert('Bungee error.');

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
    
    xhr.addEventListener("load", function(evt) {
      
      var data = JSON.parse(event.target.responseText);
      console.log(data);
      _this.uploadId = data.upload.id;
      _this.reader.readAsDataURL(_this.file);

    });
    
    var fd = new FormData();
    
    fd.append('type', this.file.type);
    fd.append('size', this.file.size);
    fd.append('filename', this.file.name);
    fd.append('keys', JSON.stringify(this.keys));
    
    var data = this.options.data;
    
    for (key in data) {
      fd.append(key, data[key].toString());
    }
    
    // var token = $('meta[name="_csrf"]').attr('content');
    // xhr.setRequestHeader('X_CSRF_TOKEN', token);
    xhr.open('POST', this.options.baseUrl + 'upload/create');
    
    xhr.send(fd);

  };
  
  this.firstPass = function() {
      
    var length = this.passes[0].length;
         
    for (j = 0; j < length; j += 1) {
      this.nextChunk(0, j);
    }
      
  };
  
  this.nextChunk = function (pass, worker) {
    
    console.log("Chunk " + pass + "." + worker);
    
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
      url: appendUrl
    }, this);
    
    delete chunk;
    
  };
  
  this.str2ab = function(str) {
    
    var buf = new ArrayBuffer(str.length*2);
    
    var bufView = new Uint16Array(buf);
    
    for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    
    return buf;
    
  };
  
}

function Downloader(id, key, options) {
  
  var _this = this;
  
  if (typeof(id) == 'undefined' ||
      typeof(key) == 'undefined') {
    
    alert('Error: empty ID or key.')
    return;
    
  } else {
  
    this.key = key;
    this.fileId = id;
    
  }
  
  this.options = {}; options = options || {};
  this.options.numWorkers = options.numWorkers || 4;
  this.options.baseUrl = options.baseUrl || '/file/';
  this.options.workerPath = options.workerPath || 
                          '/js/asocial/workers/';
  //////////
  
  this.mimeType = null;
  this.success = null;
  this.numChunks = null;
  this.downloadedChunks = 0;
  _this.finished = false;
  
  this.currentChunk = -1;
  
  this.blobDict = {};
  this.workers = [];

  this.callback = function (msg) {

    var _this = this;
    
      if (msg.data['status'] == 'ok') {

        _this.downloadedChunks += 1;

        console.log("Downloaded " + _this.downloadedChunks +
                    "/" + _this.numChunks + " chunks");

        var data = msg.data['data'];

        var worker = msg.data['worker'];
        var chunk = msg.data['chunk'];

        _this.blobDict[chunk] = data;

        if (_this.downloadedChunks == _this.numChunks) {
          console.log("SUCCESS");
          _this.success(_this.getAsBlob());
          return;
        } else if (_this.currentChunk >= _this.numChunks - 1) {
          console.log("RETURNING");
          return;
        } else {
          console.log("NEXT CHUNK");
          _this.currentChunk += 1;
          _this.nextChunk(worker, _this.currentChunk);
        }

      } else {

        alert('Bungee error.');

      }

  };
  
  this.start = function (progress, success) {
    
    this.progress = progress;
    this.success = success;
    
    if (!window.downloadWorkerPool) {
      window.downloadWorkerPool = new WorkerPool(
        this.options.workerPath + 'decrypt.js',
        this.options.numWorkers, this.callback
      );
    }
    
    this.workerPool = window.downloadWorkerPool;

    var xhr     = new XMLHttpRequest();
    var fileUrl = this.options.baseUrl +
                  'download/' + this.fileId;

    var _this = this;
    
    xhr.addEventListener("load", function(event) {
      
      var data = JSON.parse(event.target.responseText);
      _this.numChunks = data.chunks;
      _this.fileType = data.type;
      
      if (_this.numChunks < _this.options.numWorkers) {
        _this.options.numWorkers = _this.numChunks;
      }
      
      for (var n = 0; n < _this.options.numWorkers; n++) {
        _this.currentChunk += 1;
        _this.nextChunk(n, _this.currentChunk);  
      }
      
    });
    
    xhr.open("GET", fileUrl);
    xhr.setRequestHeader("X-REQUESTED-WITH", "XMLHttpRequest");
    xhr.send();
    
  };
  
  this.getAsBlob = function () {
    
    var blobBuffer = [];
  
    for (i = 0; i < this.numChunks; i++) {
      blobBuffer.push(this.blobDict[i]);
    }
    
    var mime = { type: this.fileType };
    var blob = new Blob(blobBuffer, mime);
    
    return blob;
    
  };
  
  this.nextChunk = function (worker, chunk) {
    
    console.log("Downloading chunk #" +
      chunk + " with worker " + worker);
    
    var fileUrl = this.options.baseUrl +
                  'download/' + this.fileId;

    this.workerPool.queueJob({
      id: this.fileId, chunk: chunk,
      worker: worker, key: this.key, 
      url: fileUrl
    }, this);
    
  };
  
}