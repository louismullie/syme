guard('helpers', {

  // Display error in case of AJAX post failure
  inlineError: function(html){
    $('#error-container').html(html);
  },

  formatPostsAndComments: function() {
    // Put commenter name and comment tools in first paragraph of comment
    $('.comment-box > a.commenter-name').each(function(){
      $(this).prependTo( $(this).parent().find('.collapsable p:first-child') );
    });

    // Collapse long text
    asocial.helpers.collapseHTML(5, 'See more');

    // Parse oEmbed links. Use fill mode to strip links.
    $('.post-content').oembed(); //.fitVids(); // - violates CSP
  },

  // Increment unread counter when there is a new comment/post
  newContent: function (type) {

    var newcontent = $('#newcontent');

    // Update respective counters
    if(type == "post"){
      asocial.state.feed.updatedPosts += 1;
    } else if(type == "comment"){
      asocial.state.feed.updatedComments += 1;
    }

    // Update the counter with updated count
    var total = asocial.state.feed.updatedPosts +
                asocial.state.feed.updatedComments;

    // Show and update container
    newcontent.find('a span')
      .html(total.toString());

    newcontent.show();
  },

  // Show unread posts
  showUnreadPosts: function(data){

    // Show hidden posts
    $('.post.hidden').removeClass('hidden');

    asocial.state.feed.updatedPosts = 0;

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

  replaceUserMentions: function (string)  {
    var full_names = this.findUserMentions(string);
    $.each(full_names, function (i, full_name) {
      var mention = '@' + full_name;
      string = string.replace(mention,
      "<a href='#' class='userTag'>" +
        mention + "</a>");
    });
    return string;
  },

  findUserMentions: function (string)  {
    var matches = string.match(
      /(@[A-Za-z0-9][-\w]*[A-Za-z0-9])/mg);
    var full_names = [];
    var user_list = asocial.state.group.full_names;
    if (matches == null) { return []; }
    $.each(matches, function (i, mention) {
      var full_name = mention.slice(1, mention.length);
      if (user_list.indexOf(full_name) !== -1) {
        full_names.push(full_name);
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

     $('#feed-form textarea').val('');
     $('#feed-form #upload_id').val('');
     $('#feed-form #encrypted_content').val('');
     $('#feed-form #mentioned_users').val('');
     $('#progress_bar').css('width', '0%');
     $('.textarea-supplement-file').html('');
     $('.textarea-supplement-info').show();

  },

  notificationText: function (notification) {

    var actors = '<b class="actor">' + notification.actors + '</b>';
    var action = notification.action;

    var text;

    if (action == 'new_post' || action == 'comment_on_own_post' ||
        action == 'comment_on_same_post' || action == 'like_on_post' ||
        action == 'mention_in_post') {

      resource = '<a href="/' + notification.group +
        '/posts/' + notification.post_id + '">post</a>';

    } else if(action == 'like_on_comment' ||
              action == 'mention_in_comment') {

      resource = '<a href="/' + notification.group +
      '/posts/' + notification.post_id + '/comments/' +
      notification.comment_id + '">comment</a>';

    }

    if (action == 'new_post') {

      text = actors + ' posted a new post';

    } else if (action == 'comment_on_own_post') {

      text = actors + ' commented on your ' + resource;

    } else if (action == 'comment_on_same_post') {

      text = actors + ' commented on the same ' +
             resource + ' as you';

    } else if (action == 'like_on_post' ||
               action == 'like_on_comment') {

      text = actors + ' liked your ' + resource;

    } else if (action == 'mention_in_post' ||
               action == 'mention_in_comment') {

      text = actors + ' mentioned you in a ' + resource

    } else {

      if (action == 'request_invite_confirm') {

        return text = actors + ' has asked to join  ' +
                      notification.group + '. Confirm <a href="/' +
                      notification.group_id + '" data-hbs="#">here</a>.' ;

      } else if (action == 'confirm_invite') {

        return text = actors + ' has joined the group ' +
                      notification.group + '.';

      } else {

        alert('Invalid action!');

      }

    }

    return text + ' in <a href="/' + notification.group_id +
                  '" data-hbs="#">' + notification.group + '</a>';

  },

  render: function(template, data) {
    return Handlebars.templates['_' + template](data);
  },

  getAndRender: function(template, url, callback, failure) {

    failure = failure || function(){};

    $.getJSON(url, function (data) {
      callback( asocial.helpers.render(template, data) );
    }).fail(function(){
      callback( false );
    });

  },

  showModal: function(html, options) {

    closable = typeof(options.closable) === "undefined" ? true : options.closable;
    small    = typeof(options.small)    === "undefined" ? '' : options.small;
    onshow   = typeof(options.onshow)   === "undefined" ? function(){} : options.onshow;
    onhide   = typeof(options.onhide)   === "undefined" ? function(){} : options.onhide;

    // Kill previous modal if there is one
    $('#responsive-modal').remove();

    // Create modal
    $('body').prepend('<div id="responsive-modal"><div class="container" /></div>');

    // Fill modal with content
    $('#responsive-modal > div.container').addClass(small).html(html);

    // Lock document scroll
    $('body').addClass('noscroll');

    // Bind closable event
    if(closable) {
      // Close on escape key
      $(document).on('keydown', function(e){
        // Hide modal
        if (e.which == 27) asocial.helpers.hideModal(onhide);

        // Unbind keydown
        $(this).off('keydown')
          // Unbind container click
          .find('#responsive-modal > div.container').off('click');
      });

      // Close on click
      $('#responsive-modal').on('click', function(e){
        // Hide modal
        asocial.helpers.hideModal(onhide);

        // Unbind click
        $(this).off('click')
          // Unbind container click
          .find('div.container').off('click');
      });

      // Don't close when the container is clicked
      $('#responsive-modal > div.container')
        .on('click', function(e){ e.stopPropagation(); });
    }

    // Onshow callback
    onshow();

    // Show modal
    $('#responsive-modal')
      .transition({ opacity: 1 }, 200);
  },

  hideModal: function(speed, onhide) {

    speed  = typeof(speed)  === "undefined" ? 200 : speed;
    onhide = typeof(onhide) === "undefined" ? function(){} : onhide;

    // Remove modal
    $('#responsive-modal').transition({ opacity: 0 }, speed);
    window.setTimeout(function(){ $('#responsive-modal').remove() }, speed);

    // Unlock document scroll
    $('body').removeClass('noscroll');
  }

});