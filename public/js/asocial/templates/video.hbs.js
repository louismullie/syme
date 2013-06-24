
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['video.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<video id=\"vid1\" autoplay></video>\n<video id=\"vid2\" autoplay></video>\n\n<div>\n  <button id=\"startButton\">Start</button>\n  <button id=\"callButton\">Call</button>\n  <button id=\"hangupButton\">Hang Up</button>\n</div>\n";});
Handlebars.registerPartial('video.hbs', Handlebars.templates['video.hbs']);
