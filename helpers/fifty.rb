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

Fifty.helper :to_readable_size, "
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
"

Fifty.helper :compare, %{

  function (lvalue, operator, rvalue, options) {

    var operators, result;

    if (arguments.length < 3) {
      console.log("Handlerbars Helper 'compare' needs 2 parameters");
    }

    if (options === undefined) {
      options = rvalue;
      rvalue = operator;
      operator = "===";
    }

    operators = {
      '==': function (l, r) { return l == r; },
      '===': function (l, r) { return l === r; },
      '!=': function (l, r) { return l != r; },
      '!==': function (l, r) { return l !== r; },
      '<': function (l, r) { return l < r; },
      '>': function (l, r) { return l > r; },
      '<=': function (l, r) { return l <= r; },
      '>=': function (l, r) { return l >= r; },
      '||': function (l, r) { return l || r; },
      '&&': function (l, r) { return l && r; },
      'typeof': function (l, r) { return typeof l == r; },
      'multipleof': function (l, r) { return l % r == 0; }
    };

    if (!operators[operator]) {
      console.log("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }

    result = operators[operator](lvalue, rvalue);

    if (result) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }

  }

} # Fifty.helper :compare

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