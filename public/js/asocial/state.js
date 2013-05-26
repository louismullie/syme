var asocial_state = {

  system: null,
  user: null,
  group: null,

  feed: {
    updatedPosts: 0,
    updatedComments: 0
  },

  getState: function (type, callback, options) {

    var params;
    var _this = this;

    var options = options || { force: false };

    if (this[type] && options.force == false) {
      callback(true); return;
    }

    $.getJSON('/state/' + type, $.param(options),

      function (data) {

        _this[type] = data;
        callback(true);

    }).fail(function () {
      callback(false);
    });

  }

};