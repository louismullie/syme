guard('thumbnail', {

    make: function(originalImage, mimeType, desiredWidth, desiredHeight, callback) {

      // Get canvas.
      var canvas = document.getElementById("canvas");

      // Set canvas width and height to originalImage's.
      canvas.width = desiredWidth;
      canvas.height = desiredHeight;

      // Get canvas context.
      var ctx1 = canvas.getContext("2d");

      // Calculate ratio difference
      var originalRatio = originalImage.width / originalImage.height,
          desiredRatio  = desiredWidth / desiredHeight;

      // Initialize crop variables to be filled later
      var topOffset = 0, leftOffset = 0, boxWidth = 0, boxHeight = 0;

      // Crop if ratios are different
      if ( originalRatio != desiredRatio ) {

        if ( ( desiredWidth >= desiredHeight ) && ( originalRatio >= desiredRatio ) ||
             ( desiredWidth < desiredHeight  ) && ( originalRatio < desiredRatio  ) ) {

          // Crop horizontally
          boxHeight  = originalImage.height;
          boxWidth   = Math.floor( originalImage.height * desiredRatio );
          leftOffset = Math.floor( ( originalImage.width - boxWidth ) / 2 );

        } else {

          // Crop vertically
          boxWidth  = originalImage.width;
          boxHeight = Math.floor( originalImage.width / desiredRatio );
          topOffset = Math.floor( (originalImage.height - boxHeight) / 2 );

        }

        ctx1.drawImage(
          originalImage,
          leftOffset, topOffset, boxWidth, boxHeight,
          0, 0, desiredWidth, desiredHeight
        );

      } else {

        // If aspect ratios are identical, copy original image for resizing
        ctx1.drawImage(originalImage, 0, 0, desiredWidth, desiredHeight);

      }

      var url = canvas.toDataURL(mimeType, 0.6);
      callback(this.dataURItoBlob(url));

    },

    dataURItoBlob: function(dataURI) {

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

    }

});

