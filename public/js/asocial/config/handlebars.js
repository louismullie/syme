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