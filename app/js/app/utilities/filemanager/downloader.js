function Downloader(id, keys, options) {

  var _this = this;

  if (typeof(id) == 'undefined' ||
      typeof(keys) == 'undefined') {

    alert('Download error: empty ID or key.');
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
  this.options.csrfToken  = options.csrfToken  || '';
  this.options.workerPath = options.workerPath || 'workers/';
  this.options.token = options.token || '';

  this.mimeType = null;
  this.success = null;
  this.numChunks = null;
  this.firstChunk = null;
  this.downloadedChunks = 0;
  _this.finished = false;

  this.currentChunk = -1;

  this.blobDict = {};
  this.workers = [];

  this.callback = function (msg) {

    var _this = this;

      if (msg.data['status'] == 'ok') {

        _this.downloadedChunks += 1;

        var data = msg.data['data'];

        var worker = msg.data['worker'];
        var chunk = msg.data['chunk'];

        _this.blobDict[chunk] = data;

        if (_this.downloadedChunks == _this.numChunks) {
          var firstChunk = _this.numChunks == 1 ? _this.firstChunk : null;
          _this.success(_this.getAsBlob(), firstChunk);
          return;
        } else if (_this.currentChunk >= _this.numChunks - 1) {
          return;
        } else {
          _this.currentChunk += 1;
          _this.nextChunk(worker, _this.currentChunk);
        }

      } else {

        alert('Unknown download error.');

      }

  };

  this.start = function (progress, success, error) {

    this.progress = progress;
    this.success = success;
    this.error = error;

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

    xhr.addEventListener('load', function(event) {
      
      if (event.target.status != 200) {
        return _this.error();
      }
      
      var data = JSON.parse(event.target.responseText);
      _this.numChunks = data.chunks;
      
      _this.fileType = data.type;
      _this.firstChunk = data.content;

      if (_this.numChunks < _this.options.numWorkers) {
        _this.options.numWorkers = _this.numChunks;
      }

      for (var n = 0; n < _this.options.numWorkers; n++) {
        _this.currentChunk += 1;
        _this.nextChunk(n, _this.currentChunk);
      }

    });

    var groupId = this.options.group || Syme.CurrentSession.getGroupId();
    
    Syme.Crypto.decryptMessage(groupId, this.keys, function (key) {
      
      _this.key = key;
      xhr.open("GET", fileUrl);
      xhr.setRequestHeader("X-REQUESTED-WITH", "XMLHttpRequest");
      xhr.setRequestHeader('X_CSRF_TOKEN', _this.options.csrfToken);
      xhr.setRequestHeader('AccessToken', _this.options.token);
      xhr.send();
      
    });

  };

  this.getAsBlob = function () {

    var blobBuffer = [];

    for (i = 0; i < this.numChunks; i++) {
      blobBuffer.push(this.blobDict[i]);
    }

    var mime = { type: this.fileType };
    
    if (Syme.Compatibility.onAppleWebKit())
      blobBuffer = [blobBuffer[0].buffer];
    
    var blob = new Blob(blobBuffer, mime);

    return blob;

  };

  this.nextChunk = function (worker, chunk) {

    var fileUrl = this.options.baseUrl +
                  'download/' + this.fileId;
    
    var content = (chunk == 0) ? this.firstChunk : null;
    
    this.workerPool.queueJob({
      id: this.fileId, chunk: chunk,
      worker: worker, key: this.key,
      url: fileUrl, csrf: this.options.csrfToken,
      content: content
    }, this);

  };

};