asocial.binders.add('feed', { feed_panel: function(){

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