asocial.binders.add('feed', { userlist: function(){

  var dropzone = '#feed-form';
  var draghelper = '#drag-helper';

  $('.user-icon').click(function(event) {
    var input = $(this).parent().find('.user-form input[type="file"]');
    var recipient_id = $(this).parent().attr('id');
    input.change(function (event) {
      $.post('/send/file', $.param({
        file: input.val(),
        // event.target.files[0]
        recipient_id: recipient_id,
        group: asocial.binders.getCurrentGroup()
      }));
    }).trigger('click');
  });

  // Catching click on everything to restore omnibar when it's readonly
  $('#main').on('click', function(e){
    var omnibar = $('#userlist-omnibar');

    if ( omnibar.attr('readonly') != 'readonly') {

      // Restore omnibar to default state
      omnibar
        // Hide omnibar
        .transition({ opacity: 0, duration: 100 })
        .queue(function(){
          $(this)
            // Restore to original values
            .attr('readonly', 'readonly')
            .val(omnibar.data('original-value'))

            // Show omnibar
            .transition({ opacity: 1, duration: 100 })
            .dequeue();
        });

    }
  });

  // Catch click on omnibar to prevent it from hiding
  $('#main').on('click', '#userlist-omnibar', function(e){
    e.stopPropagation();

    // Shortcut to search button if default state
    if ($(this).attr('readonly') == 'readonly' && !$(this).hasClass('locked'))
      $('#userlist a.search').click();
  });

  // Search state activator
  $('#main').on('click', '#userlist a.search', function(e){

    e.preventDefault();
    e.stopPropagation();

    var omnibar = $('#userlist-omnibar');

    // Transform fake title into search input
    omnibar
      .transition({ opacity: 0, duration: 100 })
      .queue(function(){
        $(this)
          // Clear omnibar
          .data('original-value', omnibar.val())
          .removeAttr("readonly", "readonly")
          .val('')
          .focus()

          // Show omnibar
          .transition({ opacity: 1, duration: 100 })
          .dequeue();
      });

  });

  // Catch enter on omnibar
  $('#main').on('keydown', '#userlist-omnibar', function(e){
    if (e.which == 13 && $(this).val() != "") { // Enter key
      alert('Must send search form with: ' + $(this).val());
    }
  });

  // Show invitation panel
  $('#main').on('click', 'a.invite-toggle', function(e){

    // Hide user list
    $('#list, #userlist-header a.search, #userlist-header .btn-group')
      .transition({ opacity: 0, duration: 100 })
      .css({ display: 'none' });

    // Show invite panel
    $('#invite').delay(100)
      .css({ opacity: 0, display: 'block'})
      .transition({ opacity: 1, duration: 100 });

    var omnibar = $('#userlist-omnibar');

    // Lock omnibar features
    omnibar
      .addClass('locked')

      // Hide omnibar
      .transition({ opacity: 0, duration: 100 })
      .queue(function(){

        // Show locked omnibar
        $(this)
          .data('original-value', omnibar.val())
          .val('Add a member')
          .transition({ opacity: 1, duration: 100 })
          .dequeue();

        // Show return button
        $('#locked-return')
          .css({ opacity: 0, display: 'block'})
          .transition({ opacity: 1, duration: 100 });

      });
  });

  // Go back from invitation panel
  $('#main').on('click', '#locked-return', function(e){

    $('.invited-user').addClass('hidden');
    $('.invite-user').removeClass('hidden');
    
    // Hide return button
    $(this)
      .transition({ opacity: 0, duration: 100 })
      .css({ display: 'none' });

    // Switch from invitation to userlist
    $('#invite')
      .transition({ opacity: 0, duration: 100 })
      .css({ display: 'none' });
    $('#list').delay(100)
      .css({ opacity: 0, display: 'block'})
      .transition({ opacity: 1, duration: 100 });

    var omnibar = $('#userlist-omnibar');

    // Unlock omnibar features
    omnibar
      .removeClass('locked')

      // Hide omnibar
      .transition({ opacity: 0, duration: 100 })
      .queue(function(){

        // Show normal omnibar
        $(this)
          .val(omnibar.data('original-value'))
          .transition({ opacity: 1, duration: 100 })
          .dequeue();

      });

    // Show user list
    $('#list, #userlist-header .btn-group').not('#locked-return')
      .css({ display: 'block' })
      .transition({ opacity: 1, duration: 100 });
    $('#userlist-header a.search')
      .css({ display: 'inline' })
      .transition({ opacity: 1, duration: 100 });

  });

} }); // asocial.binders.add();