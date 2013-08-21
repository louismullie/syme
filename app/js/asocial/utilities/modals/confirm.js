Syme.Confirm = {

  show: function(content, options) {

    var options  = typeof(options) === "undefined" ? {} : options;
    var closable = typeof(options.closable) === "undefined" ? true : options.closable;

    // Defaults options.classes to 'modal-confirm'
    options['classes'] = typeof(options.classes) === "undefined" ?
      'modal-confirm' : options.classes;

    // Default title, submit and cancel
    var title  = typeof(options.title) === "undefined" ? 'Confirm' : options.title;
    var submit = typeof(options.submit) === "undefined" ? 'OK' : options.submit;
    var cancel = typeof(options.cancel) === "undefined" ? 'Cancel' : options.cancel;

    // Render content
    var content = Syme.Template.render('modals-confirm',
      { content: content, closable: closable, title: title, submit: submit, cancel: cancel });

    Syme.Modal.show(content, options);

  }

};