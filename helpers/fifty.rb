Fifty.helper :hidden_if, "
  function (condition) {
    console.log(condition);
    return (condition ? 'hidden' : '');
  }
"

Fifty.helper :time_ago, "
  function (time) {
    return html;
  }
"

Fifty.helper :to_readable_size, %{
function (bytes, precision) {
  precision = precision || 2;
  var kilobyte = 1024;
  var megabyte = kilobyte * 1024;
  var gigabyte = megabyte * 1024;
  var terabyte = gigabyte * 1024;

  if ((bytes >= 0) && (bytes < kilobyte)) {
    return bytes + ' B';

  } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
    return (bytes / kilobyte).toFixed(precision) + ' KB';

  } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
    return (bytes / megabyte).toFixed(precision) + ' MB';

  } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
    return (bytes / gigabyte).toFixed(precision) + ' GB';

  } else if (bytes >= terabyte) {
    return (bytes / terabyte).toFixed(precision) + ' TB';

  } else {
    return bytes + ' B';
  }
}
}

Fifty.helper :foreach, %{

  function(arr,options) {
    if(options.inverse && !arr.length)
      return options.inverse(this);

    return arr.map(function(item,index) {

      item.$index             = index;
      item.$first             = index === 0;
      item.$last              = index === arr.length-1;
      item.$multiple_of_three = index % 3 == 0;

      return options.fn(item);
    }).join('');
  }

} # Fifty.helper :foreach

# Empty images to keep images from pushing layout down when loading
def empty_image
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
end