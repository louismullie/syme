asocial.binders.add('admin', { main: function(){

  // Remove user
  $('#main').on('click', 'a.remove-user', function(e){
    if($(this).attr("disabled") != "disabled"){
      if(prompt("Deleting this user (and all his posts) is irreversible. If you want to proceed, type in \"delete\" in the prompt box.","") == "delete"){

        var user_id = $(this).closest('tr').attr('id');
        $.post("/admin/user/delete", $.param({user_id: user_id}), function(data){
          if(data === 'true'){
            asocial.binders.loadRoute('admin');
          } else {
            asocial.helpers.inlineError(data);
          }
        });

      }
    }
  });

  // Update user
  $(".user_update").submit(function(e){
    e.preventDefault();
  });

  $(".user_update input,select,textarea").not("[type=submit]")
  .jqBootstrapValidation({ submitSuccess: function($form, e){

    e.preventDefault();

    var request = $form.serializeArray();

    request.push({
      name: "user_id",
      value: $form.closest('tr').data('user-id')
    });

    $.post("/admin/user/update", request, function(data){
      if(data === 'true'){
        asocial.binders.loadRoute('admin');
      } else {
        asocial.helpers.inlineError(data);
      }
    });

  }}); // jqBootstrapValidation

  // Interface interaction

  $('#main')
    .on('click', '#invite-user-button', function(e){
      $('#invite-user').slideToggle(200);
    })
    .on('click', '#invite-user button.close', function(e){
      $('#invite-user').hide();
    })
    .on('click', '.edit-user', function(e){
      var user_id = $(this).closest('tr').attr('id');
      var editdiv = $('[data-user-id="' + user_id + '"]');

      if(!editdiv.is(':visible')){
        $('.user-edit').hide(); // Hide every user-edit
        editdiv.slideDown('fast');
      }
    })
    .on('click', '#create-user-button', function(e){
      $('#create-user').slideDown('fast');
    })
    .on('click', '#create-user button.close', function(e){
      $('#create-user').hide();
    });


} }); // asocial.binders.add();