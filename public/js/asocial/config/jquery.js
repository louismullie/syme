// CSRF token
$.ajaxSetup({
  
  beforeSend: function(xhr) {
    
    var token = $('meta[name="_csrf"]').attr('content');
    xhr.setRequestHeader('X_CSRF_TOKEN', token);
    
  }

});

// Creating custom :external selector
$.expr[':'].external = function(obj){
  return !obj.href.match(/^mailto\:/) &&
  (obj.hostname != location.hostname);
};

// Wrap slices of a collection
$.fn.wrapSlices = function(slices, wrapper){
  // Slices a collection in 'slices' and wrap 'wrapper' around it
  // wrapper must be an html enclosing tag, like '<div/>' or '<span></span>'

  for(var i = 0; i < this.length; i+=slices) {
    // Get a slice
    this.slice(i, i+slices)
      // Wrap it in wrapper
      .wrapAll(wrapper);
  }
};