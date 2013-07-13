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