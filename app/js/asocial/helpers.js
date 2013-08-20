guard('helpers', {

  // Display error in case of AJAX post failure
  inlineError: function(html){
    $('#error-container').html(html);
  },

  // Increment unread counter when there is a new comment/post
  newContent: function (type, groupId, contentId) {

    var newcontent = $('#newcontent');
    
    // Update respective counters
    if(type == "post"){
      if (typeof(asocial.state.feed.updatedPosts[groupId]) == 'undefined')
        return;
      asocial.state.feed.updatedPosts[groupId] += 1;
    } else if(type == "comment"){
      
      // Don't show new comment button if the group is not loaded.
      if (typeof(asocial.state.feed.updatedComments[groupId]) == 'undefined')
        return;
      
      // Don't show new content button if updated comment is already visible.
      if ($('#' + contentId).length > 0)
        return;
      
      asocial.state.feed.updatedComments[groupId] += 1;
    
    }
    
    // Update the counter with updated count
    var total = asocial.state.feed.updatedPosts[groupId] +
                asocial.state.feed.updatedComments[groupId];

    // Show and update container
    newcontent.find('a span')
      .html(total.toString());

    newcontent.show();
  },

  // Show unread posts
  showUnreadPosts: function(data){

    // Show hidden posts
    $('.post').removeClass('new-post');

    var groupId = CurrentSession.getGroupId();
    asocial.state.feed.updatedPosts[groupId] = 0;

    // Hide new content button
    $('#newcontent').hide();
  },

  getFilename: function(fakepath) {
    var filename = fakepath;
    var lastIndex = filename.lastIndexOf("\\");
    if(lastIndex >= 0) {
      filename = filename.substring(lastIndex + 1);
    }
    return filename;
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

  // If DOM element is in viewport.
  elementInViewport: function(el){

    var r, html;
    if ( !el || 1 !== el.nodeType ) { return false; }
    html = document.documentElement;
    r = el.getBoundingClientRect();

    return ( !!r
      && r.bottom >= 0
      && r.right >= 0
      && r.top <= html.clientHeight
      && r.left <= html.clientWidth
    );

  },

  replaceUserMentions: function (string, groupId)  {
    
    var full_names = this.findUserMentions(string, groupId);
    
    // Add the current user to the list of other group members.
    full_names.push(CurrentSession.getUser().get('full_name'));
    
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
    var user_list = CurrentSession.getGroupMembers(groupId);
    
    $.each(user_list, function (i, user) {
      
      if (string.indexOf('@' + user) !== -1) {
        full_names.push(user);
      }
      
    });
    
    return full_names;
    
  },

  formatSize: function (bytes, precision) {
    precision = precision || 2;
    var kilobyte = 1024;
    var megabyte = kilobyte * 1024;
    var gigabyte = megabyte * 1024;
    var terabyte = gigabyte * 1024;

    if ((bytes >= 0) && (bytes < kilobyte)) {
      return bytes + ' B';

    } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
      return (bytes / kilobyte).toFixed(precision) + ' KB';

    } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
      return (bytes / megabyte).toFixed(precision) + ' MB';

    } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
      return (bytes / gigabyte).toFixed(precision) + ' GB';

    } else if (bytes >= terabyte) {
      return (bytes / terabyte).toFixed(precision) + ' TB';

    } else {
      return bytes + ' B';
    }
  },

  shortenString: function(string, maxChars) {

    return string.substr(0, maxChars - 1) +
    (string.length > maxChars ? '...' : '');

  },

  resetFeedForm: function() {

     $('#feed-form').data('active', false);
     $('#feed-form textarea').val('').css({ height: 'auto' });
     $('#feed-form #upload_id').val('');
     $('#feed-form #encrypted_content').val('');
     $('#feed-form #mentioned_users').val('');
     $('#upload-box').removeClass('active');
     $('#upload-box').hide();
     $('ul#attachments').show();

  },

  getAndRender: function(template, url, callback, failure) {

    var failure = failure || function(){};

    $.getJSON(url, function (data) {
      callback( Template.render(template, data) );
    }).fail(function(){
      callback( false );
    });

  }

});