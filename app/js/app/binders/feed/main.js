Syme.Binders.add('feed', { main: function(){

  // Fix (hide) awful chrome bug part 1
  $('#feed-panel-column').hide();

  var userId = Syme.CurrentSession.getUserId(),
      groupId = Syme.CurrentSession.getGroupId();

  var groupsUrl = 'users/' + userId + '/groups';
  var currentGroupUrl = groupsUrl + '/' + groupId;

  var currentGroupName = $('#feed').data('group-name');

  // Initial decryption
  $('.user-avatar').trigger('decrypt');
  $('.encrypted-image').trigger('decrypt');

  Syme.Decryptor.decryptPostsAndCommentsInContainer($('#feed'), function(){

    // Fix (hide) awful chrome bug part 2
    $('#feed-panel-column').show(0);

    // Initiate infinite scroller
    $(window).data('infinite-scroll-started', true);

  });

  // Prevent leaving if there's unsaved content
  $(window).bind("beforeunload", function(e) {

    Syme.Cache.clear();

    var unsavedContent = _.any($('textarea'),
      function (textarea) { return textarea.value != ''; });

    return unsavedContent ? Syme.Messages.error.unsavedContent : null;

  });

  /*$('#feed').on('showTutorial', function(){
    var $feedHider = $('<div id="feed-hider" />').prependTo('body');
    $('body').addClass('noscroll');
  });

  $('#feed').trigger('showTutorial');*/

} }); // Syme.Binders.add();