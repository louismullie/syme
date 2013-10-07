Syme.Binders.add('feed', { feed: function(){

  // Form feed focus color
  $('#textarea-holder textarea').on({
    focusin: function(){
      $(this).parent().addClass('focused');
    },
    focusout: function(){
      $(this).parent().removeClass('focused');
    }
  });

  // Unread button
  $('#main').on('click', '#newcontent a', function(e){

    if(Syme.globals.updatedComments > 0){
      // If there are new comments, reset feed
      // to reorder the bump sorting.
      Syme.Router.reload();
    } else {
      // If there are only new post, append them.
      Syme.Helpers.showUnreadPosts();
    }

  });
  
} }); // Syme.Binders.add();