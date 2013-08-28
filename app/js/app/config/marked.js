marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  langPrefix: 'language-',
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  }
});

