Handlebars.registerHelper('t',
  function(path) {
    var current = locales[locale];
    var elements = path.split('.');
    while (elements.length > 0 ) {
      current = current[elements.shift()];
    }
    return current;
  }
);

Handlebars.registerHelper('to_readable_size', function (bytes, precision) {
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
});