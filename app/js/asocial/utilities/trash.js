
/*
uploadTransfer: function (file, transfer_id) {

  this.upload(

    file, { transfer_id: transfer_id },

    function (progress) { },

    function (upload) {
      
      var params = {
        transfer_id: transfer_id,
        group_id: CurrentSession.getGroupId()
      };

      $.ajax(SERVER_URL + '/send/file/start', params);
    }

  );
},

*/

/*

guard('hangout', {

  start: function (data) {
    
    var hangoutId = data.id;

    var hangout = new Hangout('video.source', 'audio.source',
     'canvas.encrypt', 'img.frame', 'canvas.playback');

    hangout.start(hangoutId, CurrentSession.getUserId(), 'password');

    var source = new EventSource(SERVER_URL + '/hangouts/' + hangoutId);

    source.onmessage = function(e) {

      var msg = JSON.parse(e.data);

      if (msg.type == 'video') {
        hangout.frames.push(msg.data);
      }

      if (msg.type == 'audio') {
        hangout.readAudio(msg.data);
      }
    };
    
  }

});

*/