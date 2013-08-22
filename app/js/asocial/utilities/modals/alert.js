Alert = {
  
  show: function(content, options) {

    var options  = typeof(options) === "undefined" ? {} : options;
    var closable = typeof(options.closable) === "undefined" ? true : options.closable;

    // Defaults options.classes to 'modal-alert'
    options['classes'] = typeof(options.classes) === "undefined" ?
      'modal-alert' : options.classes;

    // Default title and submit
    var title  = typeof(options.title) === "undefined" ? 'Error' : options.title;
    var submit = typeof(options.submit) === "undefined" ? 'OK' : options.submit;

    var content = Template.render('modals-alert',
      { title: title, content: content, submit: submit, closable: closable });

    Modal.show(content, options);
  }
  
};