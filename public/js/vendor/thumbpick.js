ThumbPick = function (canvasSelector) {

  this.canvas = document.querySelector(canvasSelector);

};

ThumbPick.prototype = {

  thumbnail: function (options, blobCallback, urlCallback) {

    return this.process(options, blobCallback, urlCallback);

  },

  compress: function (options, blobCallback, urlCallback) {

    options.width = options.image.width;
    options.height = options.image.height;

    return this.process(options, blobCallback, urlCallback);

  },

  process: function(options, blobCallback, urlCallback) {

    // Get local variables from options.
    var originalImage = options.image;
    var mimeType = options.mime;
    var desiredWidth = options.width;
    var desiredHeight = options.height;
    var compression = options.compression;

    var urlCallback = urlCallback || function (){};

    // Set canvas width and height to originalImage's.
    this.canvas.width = desiredWidth;
    this.canvas.height = desiredHeight;

    // Get canvas context.
    var ctx1 = canvas.getContext("2d");

    // Calculate the original ratio of the image.
    var originalRatio = originalImage.width /
                        originalImage.height;

    // Calculate the desired image ratio.
    var desiredRatio  = desiredWidth / desiredHeight;

    // Initialize crop variables.
    var topOffset = 0, leftOffset = 0,
        boxWidth = 0, boxHeight = 0;

    // Crop only if ratios are different.
    if ( originalRatio != desiredRatio ) {

      if ( ( desiredWidth >= desiredHeight ) &&
           ( originalRatio >= desiredRatio ) ||
           ( desiredWidth < desiredHeight  ) &&
           ( originalRatio < desiredRatio  ) ) {

        boxHeight  = originalImage.height;
        boxWidth   = Math.floor(
          originalImage.height * desiredRatio );
        leftOffset = Math.floor(
          ( originalImage.width - boxWidth ) / 2 );


      } else {

        boxWidth  = originalImage.width;
        boxHeight = Math.floor(
          originalImage.width / desiredRatio );
        topOffset = Math.floor(
          (originalImage.height - boxHeight) / 2 );

      }

      ctx1.drawImage(
        originalImage, leftOffset, topOffset,
        boxWidth, boxHeight, 0, 0,
        desiredWidth, desiredHeight
      );

    // Ratios are the same; resize only.
    } else {

      ctx1.drawImage(originalImage, 0, 0,
        desiredWidth, desiredHeight);

    }

    // Get the data URI for the final image.
    var url = canvas.toDataURL(mimeType, 0.6);

    urlCallback(url);

    // Pass the image to callback as a Blob.
    blobCallback(this.dataURItoBlob(url));

  },

  // Converts a base64 data URI to a Blob.
  dataURItoBlob: function(dataURI) {

     var header = dataURI.split(',')[0];
     var isBase64 = header.indexOf('base64') >= 0;

     var byteString;

     if (isBase64) {
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
       var type = { type: mimeString };
       var blob = new Blob([ab], type);
       return blob;
     }

  }

};