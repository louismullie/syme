asocial.binders.add('feed', { feed_panel: function(){

  // Group photo edit button toggling
  $("div.group-photo").on({
    mouseenter: function(){
      $(this).find('a#group-photo-edit')
        .css({ display: 'block' })
        .transition({ opacity: 1}, 100);
    },
    mouseleave: function(){
      $(this).find('a#group-photo-edit')
        .transition({ opacity: 0}, 100)
        .css({ display: 'none' });
    }
  });

  // Group photo edit button action
  $('#main').on('click', '#group-photo-edit', function(e){
   $('#group-photo-file').trigger('click');
  });

  // Group photo upload
  $('#main').on('change', '#group-photo-file', function(){
    var filename = asocial.helpers.getFilename($(this).val());
    if (filename == '') { return; }

    asocial.uploader.selectGroupAvatar($(this)[0].files[0]);
  });

  $('#main').on('click', '.user-icon', function(e){
    var input = $(this).parent().find('.user-form input[type="file"]');
    var recipient_id = $(this).parent().attr('id');

    input.change(function (e) {
      $.post('/send/file', $.param({
        file: input.val(),
        // e.target.files[0]
        recipient_id: recipient_id,
        group: asocial.binders.getCurrentGroup()
      }));
    }).trigger('click');

  });

} }); // asocial.binders.add();