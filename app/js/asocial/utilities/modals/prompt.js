Syme.Prompt = {

  show: function(prompt, callback, options) {

    // Required options
    if(!callback || !prompt) throw "text and callback arguments required";

    var options  = typeof(options) === "undefined" ? {} : options;
    var closable = typeof(options.closable) === "undefined" ? true : options.closable;

    // Defaults options.classes to 'modal-prompt'
    options['classes'] = typeof(options.classes) === "undefined" ?
      'modal-prompt' : options.classes;

    // Default title, submit and cancel
    var title  = typeof(options.title) === "undefined" ? "Prompt" : options.title;
    var submit = typeof(options.submit) === "undefined" ? 'OK' : options.submit;
    var cancel = typeof(options.cancel) === "undefined" ? 'Cancel' : options.cancel;

    // Default onsubmit
    options['onsubmit'] = options['onsubmit'] || function(){
      callback( $('#responsive-modal').find('input[type="text"]').val() );
    };

    // Render content
    var content = Syme.Template.render('modals-prompt',
      { content: prompt, closable: closable, title: title, submit: submit, cancel: cancel });

    Syme.Modal.show(content, options);

  }

};