guard('hangout',
    
  dataURItoBlob: function (dataURI, callback) {

     // convert base64 to raw binary data held in a string
     // doesn't handle URLEncoded DataURIs
     var byteString;

     if (dataURI.split(',')[0].indexOf('base64') >= 0) {
         byteString = atob(dataURI.split(',')[1]);
     } else {
         byteString = unescape(dataURI.split(',')[1]);
     }

     // separate out the mime component
     var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

     // write the bytes of the string to an ArrayBuffer
     var ab = new ArrayBuffer(byteString.length);
     var ia = new Uint8Array(ab);
     for (var i = 0; i < byteString.length; i++) {
         ia[i] = byteString.charCodeAt(i);
     }

     // write the ArrayBuffer to a blob, and you're done
     if (BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder) {
       var bb = new BlobBuilder();
       bb.append(ab);
       return bb.getBlob(mimeString);
     } else {
       return new Blob([ab], { type: mimeString });
     }

  },
  
  startHangout: function () {
    
    window.URL = window.URL || window.webkitURL;
    
    navigator.getUserMedia  = navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia;
    
    var onFail = function(e) {
      alert('Your browser does not support video!');
    };

    navigator.getUserMedia(
  
    { video: true, audio: true },
      
    function(localMediaStream) {
        var video = document.querySelector('video');
        video.src = window.URL.createObjectURL(localMediaStream);
        
    }, onFail);

    setInterval(function() {
      
      var video = $('video')[0];
      if (video.videoWidth == 0) { return; }
      
      var canvas = document.querySelector('canvas.encrypt');
      var canvas2 = document.querySelector('canvas.playback');
      var image = document.querySelector('img.frame');
      
      image.onload = function () {
        canvas2.getContext('2d').drawImage(this, 0, 0);
      };
        
      canvas.width = video.videoWidth;
  	  canvas.height = video.videoHeight;
      canvas2.width = video.videoWidth;
  	  canvas2.height = video.videoHeight;
      image.width = video.videoWidth;
  	  image.height = video.videoHeight;
      
  	canvas.getContext('2d').drawImage(video, 0, 0);
    
      var url = canvas.toDataURL("image/jpeg", 0.7);
      var blob = dataURItoBlob(url);
    
      var reader = new FileReader();
    
      reader.onload = function(FREvent) {
        
          var text = FREvent.target.result;
          var encrypted = sjcl.encrypt("password", text);
          var decrypted = sjcl.decrypt("password", encrypted);
          image.src = decrypted;
     
      };
    
      reader.readAsDataURL(blob);
      
   }, 300);
  }
});