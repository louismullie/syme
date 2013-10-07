Syme.Template = {
  
  render: function(template, data) {
    return Handlebars.templates[template](data);
  }

};