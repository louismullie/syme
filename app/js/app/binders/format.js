$(document).on('format', '.post[data-formatted="false"], .comment-box[data-formatted="false"]', function (e, formattedCallback) {

  var $this         = $(this),
      $collapsable  = $this.find('.collapsable').first();

  // Sync slave avatars
  $this.find('.slave-avatar').trigger('sync');

  // Format textareas
  $this.find('textarea').trigger('formatTextarea');

  $this.find('.encrypted-image').trigger('decrypt');

  // Create a jQuery wrapper around markdown'd text
  var $content = $( marked( $collapsable.text() ) );

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
  $collapsable.html( $content );

  // Oembed.
  $collapsable.oembed();

  // Format dynamic timestamps.
  $this.find('time.timeago').timeago();

  $this.data('formatted', true).removeClass('hidden');

  (formattedCallback || $.noop)();

});
