$(document).on('format', '.post[data-encrypted="false"], .comment-box[data-encrypted="false"]', function (e, formattedCallback) {

  var $this           = $(this),
      $collapsable    = $this.find('.collapsable').first(),
      content         = $this.attr('data-content');

  $this
    .find('.slave-avatar').trigger('sync').end()
    .find('textarea').trigger('formatTextarea').end()
    .find('.encrypted-image').trigger('decrypt');

  // Create a jQuery wrapper around markdown'd text
  var $content = $( marked(content) );

  // Replace mentions
  $content.find('a[href^="id:"]').each(function(){

    // Get the part after the 'id:'
    var id = $(this).attr('href').split(':')[1];

    // Add class, remove link and add data
    $(this)
      .addClass('mentioned-user')
      .attr('href', '#')
      .attr('data-mentioned-user-id', id);

  });

  // Make sure external links open in new windows.
  $content.find('a:not([href="#"])').attr('target', '_blank');

  // Append the formatted content to collapsable
  $collapsable.append($content);

  // Format, clean container and display it
  $this
    .find('time.timeago').timeago().end()
    .oembed()
    .removeAttr('data-encrypted')
    .removeAttr('data-content')
    .removeClass('hidden');

  (formattedCallback || $.noop)();

});
