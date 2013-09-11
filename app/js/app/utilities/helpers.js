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
  showUnreadPosts: function(){

    // Show hidden posts
    $('.post').removeClass('new-post');

    var groupId = Syme.CurrentSession.getGroupId();
    Syme.globals.updatedPosts[groupId] = 0;

    // Hide new content button
    $('#newcontent').hide();
  },

  collapseHTML: function(shownLines, expanderLink){

    // Configuration
    var shownLines   = shownLines || 5,
        expanderLink = expanderLink || 'Read more';

    $('.collapsable').each(function(){

      // If current collapsable has already been collapsed once, skip
      if( $(this).find('.expand-link-container').length > 0 ) return false;

      // Compute max-height from line-height and shownLines
      var lineHeight = $(this).find('p').first().css('line-height'),
          maxHeight  = parseInt(lineHeight, 10) * (shownLines + 1);

      // If the current div needs collapsing
      if( $(this).height() > maxHeight) {

        // Don't collide with embedded iframes
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

  }

};
