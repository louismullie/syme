function Downloader(id, keys, options) {

  var _this = this;

  if (typeof(id) == 'undefined' ||
      typeof(keys) == 'undefined') {

    asocial.helpers.showAlert('Error: empty ID or key.')
    return;

  } else {
    
    this.keys = keys;
    this.key = null;
    this.fileId = id;

  }

  this.options = options || {};
  this.options.numWorkers = options.numWorkers || 4;
  this.options.baseUrl = options.baseUrl || '/file/';
  this.options.privKey = options.privKey;
  this.options.workerPath = options.workerPath || 'workers/';

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

        asocial.helpers.showAlert('Bungee error.');

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

    var groupId = this.options.group || CurrentSession.getGroupId();
    
    Crypto.decryptMessage(groupId, this.keys, function (key) {
      
      _this.key = key;
      xhr.open("GET", fileUrl);
      xhr.setRequestHeader("X-REQUESTED-WITH", "XMLHttpRequest");
      xhr.send();
      
    });

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

};