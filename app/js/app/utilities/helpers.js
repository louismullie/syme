Syme.Helpers = {

  // Increment unread counter when there is a new comment/post
  newContent: function (type, groupId, contentId) {

    var newcontent = $('#newcontent');

    // Update respective counters
    if(type == "post"){
      if (typeof(Syme.globals.updatedPosts[groupId]) == 'undefined')
        return;
      Syme.globals.updatedPosts[groupId] += 1;
    } else if(type == "comment"){

      // Don't show new comment button if the group is not loaded.
      if (typeof(Syme.globals.updatedComments[groupId]) == 'undefined')
        return;

      // Don't show new content button if updated comment is already visible.
      if ($('#' + contentId).length > 0)
        return;

      Syme.globals.updatedComments[groupId] += 1;

    }

    // Update the counter with updated count
    var total = Syme.globals.updatedPosts[groupId] +
                Syme.globals.updatedComments[groupId];

    // Show and update container
    newcontent.find('a span')
      .html(total.toString());

    newcontent.show();
  },

  // Show unread posts
  showUnreadPosts: function(data){

    // Show hidden posts
    $('.post').removeClass('new-post');

    var groupId = Syme.CurrentSession.getGroupId();
    Syme.globals.updatedPosts[groupId] = 0;

    // Hide new content button
    $('#newcontent').hide();
  },

  collapseHTML: function(shownLines, expanderLink){

    // Configuration
    var shownLines   = shownLines || 4,
        expanderLink = expanderLink || 'See more';

    $('.collapsable').each(function(){

      // If current collapsable has already been collapsed once, skip
      if( $(this).find('.expand-link-container').length > 0 ) return false;

      // Compute max-height from line-height and shownLines
      var lineHeight = $(this).find('p').first().css('line-height'),
          maxHeight  = parseInt(lineHeight, 10) * (shownLines + 1);

      // If the current div needs collapsing
      if( $(this).height() > maxHeight) {

        if ($(this).find('iframe').length > 0) return;

        $(this)
          // Collapse it
          .addClass('collapsed')
          .css('height', maxHeight)

          // Append expander link
          .find('p:first-child').append(
            '<div class="expand-link-container">' +
            '  <a href="#">' + expanderLink + '</a>' +
            '</div>')

          // Bind click to expander link
          .find('.expand-link-container a').click(function(e){
            e.preventDefault();

            var container       = $(this).closest('.collapsable'),
                realHeight      = container.prop('scrollHeight') + 'px';

            container
              .removeClass('collapsed')
              .transition({ height: realHeight }, 400, 'snap')
              .transition({ height: '' }, 0);
          });

      }

    });

  },

  replaceUserMentions: function (string, groupId)  {

    var full_names = this.findUserMentions(string, groupId);

    // Add the current user to the list of other group members.
    full_names.push(Syme.CurrentSession.getUser().get('full_name'));

    $.each(full_names, function (i, full_name) {

      var mention = '@' + full_name;

      string = string.replace(mention,
      "<a href='#' class='userTag'>" +
        mention + "</a>");

    });

    return string;

  },

  findUserMentions: function (string, groupId)  {

    var full_names = [];
    var user_list = Syme.CurrentSession.getGroupMembers(groupId);

    $.each(user_list, function (i, user) {

      if (string.indexOf('@' + user) !== -1) {
        full_names.push(user);
      }

    });

    return full_names;

  }

};
