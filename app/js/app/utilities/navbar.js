Navbar = {
  
  // json should be formatted like this
  // { brand_only: false, elements: [ *{ href: '', title: '' } ] }

  setBreadCrumb: function(json) {
    
    var template = Template.render('navbar-breadcrumbs', json);
    $('#navbar-breadcrumbs').html(template);
    
  }
  
};