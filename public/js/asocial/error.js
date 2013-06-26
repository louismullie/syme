guard('error', {

  fatalError: function () {
    
    asocial.helpers.showAlert(
      'An error has occured. We\'ve been notified ' +
      'and we\'ll address this as soon as possible.',
      {
        title: 'Oops! Something went wrong.',
        onhide: asocial.auth.disconnect
      }
    );
    
  }

});