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
    $('.post-content').oembed();

    $('time.timeago').timeago();

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

     $('#feed-form').data('active', false);
     $('#feed-form textarea').val('');
     $('#feed-form #upload_id').val('');
     $('#feed-form #encrypted_content').val('');
     $('#feed-form #mentioned_users').val('');
     $('#upload-box').hide();
     $('ul#attachments').show();

  },

  notificationText: function (notification) {

    var actors = '<b class="actor">' + notification.actors + '</b>';
    var action = notification.action;

    var text, ressource;

    if (action == 'new_post' ||
        action == 'comment_on_same_post' ||
        action == 'like_on_post' ||
        action == 'mention_in_post') {

      resource =  '<a hbs href="' +
                  '/users/'   + asocial.state.user.id +
                  '/groups/'  + notification.group_id +
                  '/posts/'   + notification.post_id +
                  '">post</a>';

    } else if(action == 'like_on_comment' ||
              action == 'mention_in_comment' ||
              action == 'comment_on_own_post' ) {

      resource =  '<a hbs href="' +
                  '/users/'   + asocial.state.user.id +
                  '/groups/'  + notification.group_id +
                  '/posts/'   + notification.post_id +
                  '#'         + notification.comment_id +
                  '">post</a>';

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

        return text = actors + ' has asked to join  ' + notification.group +
                      '<a hbs href="' +
                      '/users/'   + asocial.state.user.id +
                      '/groups/'  + notification.group_id +
                      '">Confirm here</a>.';

      } else if (action == 'confirm_invite') {

        return text = actors + ' has joined the group ' + notification.group + '.';

      } else {

        asocial.helpers.showAlert('Invalid action.', { onhide: location.reload });

      }

    }

    return text + ' on <a hbs href="' +
                  '/users/'   + asocial.state.user.id +
                  '/groups/'  + notification.group_id +
                  '">' + notification.group + '</a>.';

  },

  render: function(template, data) {
    return Handlebars.templates[template + '.hbs'](data);
  },

  getAndRender: function(template, url, callback, failure) {

    var failure = failure || function(){};

    $.getJSON(url, function (data) {
      callback( asocial.helpers.render(template, data) );
    }).fail(function(){
      callback( false );
    });

  },

  navbarBreadcrumbs: function(json) {
    // json should be formatted like this
    // { brand_only: false, elements: [ *{ href: '', title: '' } ] }

    var template = this.render('navbar-breadcrumbs', json);
    $('#navbar-breadcrumbs').html(template);
  },

  showModal: function(html, options) {

    var options  = typeof(options)          === "undefined" ? {} : options;

    // Options
    var closable = typeof(options.closable) === "undefined" ? true : options.closable;
    var classes  = typeof(options.classes)  === "undefined" ? '' : options.classes;

    // Callbacks
    var onshow   = typeof(options.onshow)   === "undefined" ? function(){} : options.onshow;
    var onhide   = typeof(options.onhide)   === "undefined" ? function(){} : options.onhide;
    var onsubmit = typeof(options.onsubmit) === "undefined" ? '' : options.onsubmit;

    // Kill previous modal if there is one
    $(document).off('keydown');
    $('#responsive-modal').remove();

    // Create modal
    $('body').prepend(
      '<div id="responsive-modal">' +
      '  <div class="container ' + classes + '" />' +
      '</div>'
    );

    // Bind close callbacks to modal
    $('#responsive-modal').data('onhide', onhide).data('onsubmit', onsubmit);

    // Fill modal with content
    $('#responsive-modal > div.container').html(html);

    // Additional closable events
    if(closable) {

      // Close on escape
      $(document).one('keydown', function(e){
        if ( e.which == 27 ) asocial.helpers.hideModal();
      });

      // Close on outside click
      $('#responsive-modal').click(function(){
        asocial.helpers.hideModal();
      });

      $('#responsive-modal div.container').click(function(e){
        e.stopPropagation();
      });

    }

    // Submit on enter key
    $(document).one('keydown', function(e){
      if ( e.which == 13 ) asocial.helpers.hideModal(true);
    });

    // Close on clicking a[role="close-modal"]
    $('#responsive-modal a[role="close-modal"]').click(function(e){
      e.preventDefault();
      asocial.helpers.hideModal();
    });

    // Submit on clicking a[role="submit-modal"]
    $('#responsive-modal a[role="submit-modal"]').click(function(e){
      e.preventDefault();
      asocial.helpers.hideModal(true);
    });

    // Submit on clicking a[role="submit-modal"]
    $('#responsive-modal a[role="submit"]').click(function(e){
      e.preventDefault();
      $('#responsive-modal form').submit();
    });

    // Callback
    onshow();

    // Lock document and blur it
    $('body').addClass('noscroll modal-blur');
    document.ontouchmove = function(e) { e.preventDefault(); }

    // Show modal
    $('#responsive-modal').transition({ opacity: 1 }, 200);

    // Focus on first input[type="text"] or textarea
    $('#responsive-modal').find('input[type="text"], textarea').first().focus();
  },

  hideModal: function( submitted ) {

    // Callbacks
    if ( submitted && $('#responsive-modal').data('onsubmit') ) {
      // onsubmit()
      $('#responsive-modal').data('onsubmit')();
    } else {
      // onhide()
      $('#responsive-modal').data('onhide')();
    }

    // Unbind remaining keydown events
    $(document).off('keydown');

    // Remove modal
    $('#responsive-modal').transition({ opacity: 0 }, 200);
    window.setTimeout(function(){ $('#responsive-modal').remove() }, 200);

    // Unlock document scroll
    $('body').removeClass('noscroll modal-blur');
    document.ontouchmove = function(e) { return true; }

  },

  showAlert: function(content, options) {

    var options  = typeof(options) === "undefined" ? {} : options;
    var closable = typeof(options.closable) === "undefined" ? true : options.closable;

    // Defaults options.classes to 'modal-alert'
    options['classes'] = typeof(options.classes) === "undefined" ?
      'modal-alert' : options.classes;

    // Default title and submit
    var title  = typeof(options.title) === "undefined" ? 'Error' : options.title;
    var submit = typeof(options.submit) === "undefined" ? 'OK' : options.submit;

    var content = this.render('modals-alert',
      { title: title, content: content, submit: submit, closable: closable });

    this.showModal(content, options);
  },

  showConfirm: function(content, options) {

    var options  = typeof(options) === "undefined" ? {} : options;
    var closable = typeof(options.closable) === "undefined" ? true : options.closable;

    // Defaults options.classes to 'modal-confirm'
    options['classes'] = typeof(options.classes) === "undefined" ?
      'modal-confirm' : options.classes;

    // Default title, submit and cancel
    var title  = typeof(options.title) === "undefined" ? 'Confirm' : options.title;
    var submit = typeof(options.submit) === "undefined" ? 'OK' : options.submit;
    var cancel = typeof(options.cancel) === "undefined" ? 'Cancel' : options.cancel;

    // Render content
    var content = this.render('modals-confirm',
      { content: content, closable: closable, title: title, submit: submit, cancel: cancel });

    this.showModal(content, options);

  },

  showLightbox: function(url) {

    // Url is required to proceed
    if ( typeof(url) === "undefined" ) return false;

    var template = this.render('feed-modals-lightbox', { url: url });

    this.showModal(template, {
      classes: 'modal-lightbox',

      onshow: function() {
        $().binders['modals']['lightbox']();
      }
    });

  }

});