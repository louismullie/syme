/*
 * Color Thief v1.0
 * Originally by Lokesh Dhakar - http://www.lokeshdhakar.com
 * Modified by Thomas Park - http://www.thomaspark.me
 *
 * Licensed under the Creative Commons Attribution 2.5 License - http://creativecommons.org/licenses/by/2.5/
 *
 * # Thanks
 * Nick Rabinowitz: Created quantize.js which is used by the median cut palette function. This handles all the hard clustering math.
 * John Schulz: All around mad genius who helped clean and optimize the code. @JFSIII
 *
 * ## Classes
 * CanvasImage
 * ## Functions
 * getDominantColor()
 * createPalette()
 * getAverageRGB()
 * createAreaBasedPalette()
 *
 * Requires jquery and quantize.js.
 */

/*
  CanvasImage Class
  Class that wraps the html image element and canvas.
  It also simplifies some of the canvas context manipulation
  with a set of helper functions.
*/

var CanvasImage = function (image) {
    // If jquery object is passed in, get html element
    imgEl = (image.jquery) ? image[0] : image;

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);

    this.width = this.canvas.width = imgEl.width;
    this.height = this.canvas.height = imgEl.height;

    this.context.drawImage(imgEl, 0, 0, this.width, this.height);
};

CanvasImage.prototype.clear = function () {
    this.context.clearRect(0, 0, this.width, this.height);
};

CanvasImage.prototype.update = function (imageData) {
    this.context.putImageData(imageData, 0, 0);
};

CanvasImage.prototype.getPixelCount = function () {
    return this.width * this.height;
};

CanvasImage.prototype.getImageData = function () {
    return this.context.getImageData(0, 0, this.width, this.height);
};

CanvasImage.prototype.removeCanvas = function () {
    $(this.canvas).remove();
};

function createPalette(sourceImage, colorCount) {

    // Create custom CanvasImage object
    var image = new CanvasImage(sourceImage),
        imageData = image.getImageData(),
        pixels = imageData.data,
        pixelCount = image.getPixelCount();

    // Store the RGB values in an array format suitable for quantize function
    var pixelArray = [];
    for (var i = 0, offset, r, g, b, a; i < pixelCount; i++) {
        offset = i * 4;
        r = pixels[offset + 0];
        g = pixels[offset + 1];
        b = pixels[offset + 2];
        a = pixels[offset + 3];
        // If pixel is mostly opaque and not white
        if (a >= 125) {
            if (!(r > 250 && g > 250 && b > 250)) {
                pixelArray.push([r, g, b]);
            }
        }
    }

    // Send array to quantize function which clusters values
    // using median cut algorithm

    var cmap = MMCQ.quantize(pixelArray, colorCount);
    var palette = cmap.palette();

    // Clean up
    image.removeCanvas();

    return palette;
}

function getColors(sourceImage) {

    var threshold = 0.15;

    // Create custom CanvasImage object
    var image = new CanvasImage(sourceImage),
        imageData = image.getImageData(),
        pixels = imageData.data,
        pixelCount = image.getPixelCount();

    // Store the RGB values in an array format suitable for quantize function
    var pixelArray = [];
    var bgPixelArray = [];
    for (var i = 0, offset, r, g, b, a; i < pixelCount; i++) {
        offset = i * 4;
        r = pixels[offset + 0];
        g = pixels[offset + 1];
        b = pixels[offset + 2];
        a = pixels[offset + 3];
        // If pixel is mostly opaque and not white
        if (a >= 125) {
            if (!(r > 250 && g > 250 && b > 250)) {
                pixelArray.push([r, g, b]);

                if ((i < pixelCount * threshold) || (i % image.height < image.width * threshold / 2)) {
                    bgPixelArray.push([r, g, b]);
                }
            }
        }
    }

    // Send array to quantize function which clusters values
    // using median cut algorithm

    var cmap = MMCQ.quantize(pixelArray, 5);
    var palette = cmap.palette();

    var bgCmap = MMCQ.quantize(bgPixelArray, 5);
    var bgPalette = bgCmap.palette();

    // Clean up
    image.removeCanvas();

    return [palette, bgPalette[0]];
}

function getContrastYIQ(color) {
    var r = color[0],
        g = color[1],
        b = color[2];

    var yiq = ((r*299)+(g*587)+(b*114))/1000;

    // return (yiq >= 128) ? 'light' : 'dark';
    return yiq;
}

function getDefaultColor(yiq){
    return (yiq >= 128) ? [0, 0, 0] : [255, 255, 255];
}

function inverseColors(color, palette) {

    var yiq = getContrastYIQ(color);
    var colors = [],
        primaryColor,
        secondaryColor;

    for (var i = 0; i < palette.length; i++) {

        if (Math.abs(getContrastYIQ(palette[i]) - yiq) > 80) {
            colors.push(palette[i]);
        }
    }

    primaryColor = colors[0] ? colors[0] : getDefaultColor(yiq);
    secondaryColor = colors[1] ? colors[1] : getDefaultColor(yiq);

    return [primaryColor, secondaryColor];
}

function getInverseRgbColor(dominant, median) {
  var colors = inverseColors(dominant, median);
  return [ arrayToRgb(colors[0]), arrayToRgb(colors[1]) ];
}

function arrayToRgb(arr) {
  // Converts a RGB array [xxx, xxx, xxx] into valid CSS color
  return 'rgb(' + arr.join(',') + ')';
}

function transparencize(rgb, opacity) {
  // Converts a CSS RGB color into transparent RGBA
  return rgb.replace("rgb", "rgba").replace(")", "," + opacity + ")");
}