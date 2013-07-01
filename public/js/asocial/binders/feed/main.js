asocial.binders.add('feed', { main: function(){

  asocial.helpers.navbarBreadcrumbs({
    brand_only: false,

    elements: [
      { title: 'Groups',
        href: 'users/' + asocial.state.user.id + '/groups' },

      { title: $('#feed').data('group-name'),
        href: Backbone.history.fragment }
    ]
  });

} }); // asocial.binders.add();