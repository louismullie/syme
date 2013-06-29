asocial.binders.add('feed', { main: function(){

  // Navbar group selector
  $('#group-selector')
    .css('display', 'inline-block')
    .find('li.group')
      .html( $('#feed').data('group-name') );

} }); // asocial.binders.add();