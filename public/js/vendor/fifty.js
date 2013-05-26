var Fifty = {

  render: function(template, data) { 
    var data = data || {};
    var hbs  = '{{> ' + template + '}}';
    var tmpl = Handlebars.compile(hbs);
    return tmpl(data);
  },

  getAndRender: function(template, url, callback, failure) {

    failure = failure || function(){};

    $.getJSON(url, function (data) {
      callback( Fifty.render(template, data) );
    }).fail(function(){
      callback( false );
    });

  },

  postAndRender: function(name, params) {
    $.post('/' + name + '.json', $.param(params),
    function (data) {
      Fifty.render(name, data);
    });
  },

  replace: function(id, name, data) {
    $(id).html(Fifty.render(name, data));
  },

  getAndReplace: function(id, name, params) {
    $(id).html(Fifty.getAndRender(name, params));
  },

  postAndReplace: function(id, name, params) {
    $(id).html(Fifty.postAndRender(name, params));
  },

  append: function(id, name, data) {
    $(id).append(Fifty.render(name, data));
  },

  getAndAppend: function(id, name, params) {
    $(id).append(Fifty.getAndRender(name, params));
  },

  postAndAppend: function(id, name, params) {
    $(id).append(Fifty.postAndRender(name, params));
  },

  postAndRemove: function(id, name, params) {
    $.post('/' + name + '.json', $.param(param),
    function () {
      $(id).remove();
    });
  }

};