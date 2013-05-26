;(function ($) {

    // Create our namespace.
    if (!$.oembed) {
        $.oembed = {};
    };
    
    $.oembed.config = {
      width: 420,
      height: 345
    };
    
    // URLs to JSONP apis.
    $.oembed.apis = {
        youtube: "https://gdata.youtube.com/feeds/api/videos/#tag#?v=2&alt=json-in-script&callback=?",
        vimeo: "https://vimeo.com/api/oembed.jsonp?url=#tag#&callback=?",
        dailyMotion: "https://www.dailymotion.com/api/oembed?url=#tag#&callback=?",
        twitter: "https://api.twitter.com/1/statuses/oembed.json?url=#tag#&callback=?"
    };
    
    // URLs to match in links.
    $.oembed.schemes = {
        youtube: [
            "https?:\/\/www\.youtube\\.com/watch.+v=[\\w-]+&?",
            "https?:\/\/www\.youtu\\.be/[\\w-]+",
            "https?:\/\/www\.youtube.com/embed"],
        vimeo: [
            "https?:\/\/www\.vimeo\.com\/groups\/.*\/videos\/.*",
            "https?:\/\/www\.vimeo\.com\/.*",
            "https?:\/\/www\.vimeo\.com\/groups\/.*\/videos\/.*",
            "https?:\/\/www\.vimeo\.com\/.*"],
        dailyMotion: ["https?:\/\/www\.dailymotion\\.com/.+"],
        twitter: ["https?:\/\/twitter.com/.+"]
    };

    // Regexps to extract IDs from URLs, when it is 
    // not the URL itself that is passed to the API.
    $.oembed.extractors = {
        youtube: /.*(?:v\=|be\/|embed\/)([\w\-]+)&?.*/
    };

    // Templates to build HTML from a tag (URL/ID),
    $.oembed.templates = {
        youtube: "<iframe src=\"https://www.youtube.com/embed/#tag#\"" +
                 "width=\"#width#\" height=\"#height#\"></embed>"
    };
    
    // Get HTML either by building an HTML template with
    // the extracted ID or by calling an HTTPS JSONP API.
    $.oembed.getHTML = function (provider, tag, node) {
      var template = this.templates[provider];
      if (template) {
        node.replaceWith(template.replace("#tag#", tag)
        .replace("#width#", this.config.width)
        .replace("#height#", this.config.height));
      } else {
        var url = this.apis[provider].replace('#tag#', tag);
        $.getJSON(url, null, function (data) {
            node.replaceWith(data.html);
        });
      }
    };
    
    $.oembed.match = function (url, node) {
        for (var provider in this.schemes) {
            var schemes = this.schemes[provider];
            var extractor = this.extractors[provider];
            for (var i = 0; i < schemes.length; i++) {
                var regExp = new RegExp(schemes[i], "i");
                var match = url.match(regExp);
                if (!(match !== null)) { continue; }
                if (extractor) {
                    var tag = url.match(extractor)[1];
                } else {
                    var tag = match[0];
                }
                tag = encodeURIComponent(tag);
                return this.getHTML(provider, tag, node)
            }
        }
    };
    $.fn.oembed = function () {
        return this.each(function () {
            var $this = $(this);
            $this.find("a").each(function (i, link) {
                $container = $(link);
                var url = $container.attr('href');
                $.oembed.match(url, $container);
            });
        });
    };
})(jQuery);