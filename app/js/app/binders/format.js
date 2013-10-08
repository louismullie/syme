$(document).on('format', '.post[data-formatted="false"], .comment-box[data-formatted="false"]', function (e, formattedCallback) {

  var $this           = $(this),
      $collapsable    = $this.find('.collapsable').first(),
      // Commenter name hack part 3
      trimmedContent  = $collapsable.find('a.commenter-name').length ?
        $collapsable.clone().children().remove().end().text() :
        $collapsable.text();

  // Sync slave avatars
  $this.find('.slave-avatar').trigger('sync');

  // Format textareas
  $this.find('textarea').trigger('formatTextarea');

  $this.find('.encrypted-image').trigger('decrypt');

  // Create a jQuery wrapper around markdown'd text
  var $content = $( marked(trimmedContent) );

  // Replace mentions
  $content.find('a[href^="id:"]').each(function(){

    // Get the part after the 'id:'
    var id = $(this).attr('href').split(':')[1];

    // Add class, remove link and add data
    $(this).addClass('mentioned-user')
           .attr('href', '#')
           .attr('data-mentioned-user-id', id);

  });

  // Make sure external links open in new windows.
  $content.find('a:not([href="#"])').attr('target', '_blank');

  // Replace old content by formatted content
  // Commenter name hack part 4
  var replacedHtml = $content[0] ?
    $collapsable.html().replace(trimmedContent, $content[0].outerHTML) :
    $content.html();

  $collapsable.html(replacedHtml);

  // Oembed.
  $collapsable.oembed();

  // Format dynamic timestamps.
  $this.find('time.timeago').timeago();

  $this.data('formatted', true).removeClass('hidden');

  (formattedCallback || $.noop)();

});
