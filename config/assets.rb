# Require and configure assets
register Sinatra::AssetPack

assets do

  base = [File.dirname(__FILE__), 'public', 'css']

  # Add load paths to sass so it doesn't go hysterical
  Sass.load_paths << File.join(*base)
  Sass.load_paths << File.join(*base, 'asocial')
  Sass.load_paths << File.join(*base, 'vendor')

  # Paths for serving static files.
  serve '/js',    from: 'public/js'
  serve '/css',   from: 'public/css'
  serve '/img',   from: 'public/img'
  serve '/flash', from: 'public/flash'

  # Asocial JS
  js :asocial, '/js/asocial.js', [
    # Guard must go first to
    # lock defined functions.
    '/js/asocial/guard.js',
    # Require vendor config
    # and jQuery extensions,
    '/js/asocial/config/*.js',
    # Cryptographic utilities.
    '/js/asocial/crypto.js',
    # Application helpers.
    '/js/asocial/helpers.js',
    # Url parsing utilities.
    '/js/asocial/url.js',
    # Binder-related utilities.
    '/js/asocial/binders.js',
    # WebSocket connector.
    '/js/asocial/socket.js',
    # File uploads/downloads.
    '/js/asocial/uploader.js',
    # Thumbnail generator.
    '/js/asocial/thumbnail.js',
    # Handlebars templates.
    '/js/asocial/templates.js',
    # Authenticator helpers.
    '/js/asocial/auth.js',
    # Application state.
    '/js/asocial/state.js',
    # Invitation management.
    '/js/asocial/invite.js',
    # Namespace aggregator.
    '/js/asocial/asocial.js',
    # Testing environment
    '/js/asocial/test.js',
    # Enable route binders.
    '/js/asocial/binders/**/*.js',
    # Require core classes.
    '/js/asocial/classes/*.js',
    '/js/asocial/binders/global.js'
  ]

  # Vendor JS
  js :vendor, '/js/vendor.js', [
    # Require jQuery before everything.
    '/js/vendor/jquery-1.9.1.min.js',
    '/js/vendor/rsa.js',
    '/js/vendor/yahoo.min.js',
    '/js/vendor/underscore.min.js',
    '/js/vendor/backbone.min.js',
    '/js/vendor/backbone-relational.js',
    # Require all other vendor scripts.
    '/js/vendor/*.js'
  ]

  # Asocial CSS
  css :asocial, '/css/asocial.css', [
    # Application styles.
    '/css/includer.css'
  ]

  # Vendor CSS
  css :vendor, '/css/vendor.css', [
    # Font Awesome
    '/css/vendor/font-awesome.css',
    # JQuery OhEmbed plugin styles.
    '/css/vendor/jquery.ohembed.css',
    # Mediaelement audio/video player.
    '/css/vendor/mediaelement.css',
    # CSS-only tooltips
    '/css/vendor/css-tooltips.css',
    # Github theme for highlight-js
    '/css/vendor/hljs.github.css'
  ]

  # Active in production mode only #

  # Compress Javascript.
  js_compression  :closure
  # Compress/minify CSS.
  css_compression :sass
  # Caches JS/CSS on startup.
  prebuild true

end