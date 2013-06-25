$.fn.renderHbsTemplate = function(data){
  this.html( Handlebars.templates[ this.attr('partial') + '.hbs' ](data) );

  return this;
}

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

Handlebars.registerHelper("debug", function(optionalValue) {
  console.log('Current context:', this);

  if (optionalValue) {
    console.log('Additional value:', optionalValue);
  }
});

Handlebars.registerHelper("current_user_id", function() {
  return asocial.state.user.id;
});

Handlebars.registerHelper("current_group_id", function() {
  return asocial.state.group.id;
});

Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {

  // {{#compare variable ">" 5}}
  // There are more than 5 of {{variable}}
  // {{/compare}}

  // {{#compare "Test" "Test"}}
  // Default comparison of "==="
  // {{/compare}}

  var operators, result;

  if (arguments.length < 3) {
    throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
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
    'typeof': function (l, r) { return typeof l == r; }
  };

  if (!operators[operator]) {
    throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
  }

  result = operators[operator](lvalue, rvalue);

  if (result) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }

});