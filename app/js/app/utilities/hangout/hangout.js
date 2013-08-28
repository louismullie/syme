Hangout = function (videoSource, audioSource, encryptCanvas, imageFrame, playbackCanvas) {
  
  window.URL = window.URL || window.webkitURL;
  
  navigator.getUserMedia= navigator.getUserMedia ||
  navigator.webkitGetUserMedia|| navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;
  
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  
  window.MediaSource = window.MediaSource || window.WebKitMediaSource;
  
  this.frames = [];
  this.audios = [];
  
  this.localMediaStream = null
  
  this.videoSourceSelector = videoSource;
  this.videoSource = null;
  
  this.encryptCanvasSelector = encryptCanvas;
  this.encryptCanvas = null;
  this.encryptContext = null;
  
  this.imageFrameSelector = imageFrame;
  this.imageFrame = null;
  
  this.playbackCanvasSelector = playbackCanvas;
  this.playbackCanvas = null;
  this.playbackContext = null;
  
  this.audioContext = new AudioContext();
  this.audioSource = null;
  this.audioBuffer = null;
  this.audioPlaybackContext = null;
  
  this.userId = null;
  this.password = null;
  
  audioPlaybackContext = new AudioContext();
  
  var _this = this;

  var playback = document.querySelector('video.audio');
  var mediaSource = new MediaSource();
  playback.src = window.URL.createObjectURL(mediaSource);
  
  this.startVideo = function () {

    var w = _this.videoSource.videoWidth;
    var h = _this.videoSource.videoHeight;
    
    _this.playbackCanvas = document.querySelector(
        _this.playbackCanvasSelector);
    
    _this.playbackCanvas.width = w;
    _this.playbackCanvas.height = h;
    _this.playbackContext = _this
      .playbackCanvas.getContext('2d');
      
    _this.encryptCanvas.width = w;
    _this.encryptCanvas.height = h;
    _this.encryptContext = 
      _this.encryptCanvas.getContext('2d');
    
    _this.imageFrame.width = w;
    _this.imageFrame.height = h;

    _this.imageFrame.onload = function () {
       _this.playbackContext.drawImage(this, 0, 0);
    }; 

    setInterval(_this.sendFrame, 200);
    
    requestAnimationFrame(_this.drawFrame);

  };
  
  this.sendFrame = function () {
    
     _this.encryptContext.drawImage(
      _this.videoSource, 0, 0); 

    var frameUrl = _this.encryptCanvas
      .toDataURL("image/jpeg", 0.15);

    var frame = _this.dataURItoBlob(frameUrl);

    var frameReader = new FileReader();

    frameReader.onload = _this.loadFrame;

    frameReader.readAsDataURL(frame);
    
  };
  
  this.encryptAudio = function (audioJson) {
    
    var encryptedAudio = sjcl.encrypt(
      _this.password, JSON.stringify(audioJson));
      
    delete audioJson
    
    //_this.postAudio(encryptedAudio);
      
  };
  
  this.readAudio = function (encryptedAudio) {
    
    var decryptedAudio = sjcl.decrypt(_this.password, encryptedAudio);
    var audioJson = JSON.parse(decryptedAudio);
    
    var blob = _this.dataURItoBlob(audioJson.wav);
    
    var reader = new FileReader();

    reader.onload = function (event) {

      var arrayBuffer = event.target.result;

      audioPlaybackContext.decodeAudioData(arrayBuffer, function (audioBuffer) {

        var playbackBufferSource = audioPlaybackContext.createBufferSource();

        playbackBufferSource.connect(audioPlaybackContext.destination);
        playbackBufferSource.buffer = audioBuffer;
        playbackBufferSource.start(audioJson.time);

        delete playbackBuffer;

      });

    };

    reader.readAsArrayBuffer(blob);
    
  };

  this.drawFrame = function () {
    
    var frameData = _this.readFrame();

    if (frameData)
      _this.imageFrame.src = frameData;
    
    requestAnimationFrame(_this.drawFrame);
    
  };
  
  this.loadFrame = function(FREvent) {
    
    var frameText = FREvent.target.result;
    
    var encryptedFrame = sjcl
      .encrypt(_this.password, frameText);
    
    delete FREvent;
    delete frameText;
    
    _this.postFrame(encryptedFrame);
    
    delete encryptedFrame;
    
  };
  
  this.postFrame = function (encryptedFrame) {
    
    var fd = new FormData();

    fd.append('data', 'video');
    
    fd.append('hangout_id', this.hangoutId);
    
    fd.append('frame', encryptedFrame);

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("error", function(evt) {
      throw "Client error on upload.";
    }, false);

    xhr.addEventListener("abort", function(evt) {
      throw "Upload aborted.";
    }, false);

    xhr.addEventListener("load", function(evt) {
      //console.log(evt.response);
    });
    
    xhr.open('PUT', SERVER_URL + '/hangouts');
    
    xhr.send(fd);
    
  };

  this.postAudio = function (encryptedFrame) {
    
    var fd = new FormData();
    
    fd.append('data', 'audio');
    fd.append('hangout_id', this.hangoutId);
    fd.append('frame', encryptedFrame);

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("error", function(evt) {
      throw "Client error on upload.";
    }, false);

    xhr.addEventListener("abort", function(evt) {
      throw "Upload aborted.";
    }, false);

    xhr.addEventListener("load", function(evt) {
      //console.log(evt.response);
    });
    
    xhr.open('PUT', SERVER_URL + '/hangouts');
    
    xhr.send(fd);
    
  };
  
};

Hangout.prototype = {
  
  start: function (hangoutId, userId, password) {
    
    this.hangoutId = hangoutId;
    this.userId = userId;
    this.password = password;
    
    if (!this.password)
      throw 'Must supply a password';
    
    var _this = this;
    
    navigator.getUserMedia(

      { video: true, audio: true },

      function(localMediaStream) {
        
        _this.localMediaStream = localMediaStream;
        var audioContext = new AudioContext();
        
        _this.audioBuffer = audioPlaybackContext.createBuffer(1, 1024, sampleRate);
        
        var sampleRate = audioContext.sampleRate;

        var audioSource = audioContext.createMediaStreamSource(localMediaStream);
        var node = audioContext.createJavaScriptNode(1024, 2, 2);
        
        // Heartbeat to prevent closing.
        function heartbeat() { }

        function startAudio() {
          
          node.onaudioprocess = function(e){

            var time = audioContext.currentTime;
            
            var l = e.inputBuffer.getChannelData(0);
            var r = e.inputBuffer.getChannelData(0);
            var blob = exportWAV([l], [r], 'audio/wav', sampleRate);

            var reader = new FileReader();

            reader.onload = function (event) {
              _this.encryptAudio({
                wav: event.target.result,
                time: time
              });
            };

            reader.readAsDataURL(blob);

            delete reader;

          };
      
          audioSource.connect(node);
          node.connect(audioContext.destination);
    
        } // startAudio
      
        _this.videoSource = document
          .querySelector(_this.videoSourceSelector);
        
        _this.imageFrame = document
          .querySelector(_this.imageFrameSelector);
          
        _this.encryptCanvas = document.querySelector(
          _this.encryptCanvasSelector);
      
        _this.playbackCanvas = document.querySelector(
            _this.playbackCanvasSelector);

        _this.playbackContext = _this.
          playbackCanvas.getContext('2d');
      
        _this.videoSource.addEventListener(
          "canplay", _this.startVideo);
        
        var videoUrl = window.URL
          .createObjectURL(localMediaStream);
        
        _this.videoSource.src = videoUrl;
      
        startAudio();
        
        setInterval(heartbeat, 200);
        
      },
      
      this.failVideoRequest);
    
  },
  
  failVideoRequest: function (e) {
    alert('Your browser does not support video!');
  },
  
  
  readFrame: function () {
    
    var encryptedFrame = this.frames.shift();

    if (!encryptedFrame) return null;
    
    var frameData = sjcl.decrypt(
      this.password, encryptedFrame);

    return frameData;

  },
  
  dataURItoBlob: function(dataURI, callback) {

     var byteString;

     if (dataURI.split(',')[0].indexOf('base64') >= 0) {
         byteString = atob(dataURI.split(',')[1]);
     } else {
         byteString = unescape(dataURI.split(',')[1]);
     }

     var mimeString = dataURI.split(',')[0]
        .split(':')[1].split(';')[0];

     var ab = new ArrayBuffer(byteString.length);
     var ia = new Uint8Array(ab);
     for (var i = 0; i < byteString.length; i++) {
         ia[i] = byteString.charCodeAt(i);
     }

     var BlobBuilder = window.WebKitBlobBuilder ||
                       window.MozBlobBuilder;

     if (BlobBuilder) {
       var bb = new BlobBuilder();
       bb.append(ab);
       return bb.getBlob(mimeString);
     } else {
       return new Blob([ab], { type: mimeString });
     }

  }
  
};

/*

guard('hangout', {

  start: function (data) {
    
    var hangoutId = data.id;

    var hangout = new Hangout('video.source', 'audio.source',
     'canvas.encrypt', 'img.frame', 'canvas.playback');

    hangout.start(hangoutId, Syme.CurrentSession.getUserId(), 'password');

    var source = new EventSource(SERVER_URL + '/hangouts/' + hangoutId);

    source.onmessage = function(e) {

      var msg = JSON.parse(e.data);

      if (msg.type == 'video') {
        hangout.frames.push(msg.data);
      }

      if (msg.type == 'audio') {
        hangout.readAudio(msg.data);
      }
    };
    
  }

});

*/