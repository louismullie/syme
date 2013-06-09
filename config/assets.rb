=begin
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
    # Require vendors before everything.
    
  ]

  # Asocial CSS
  css :asocial, '/css/asocial.css', [
    # Application styles.
    '/css/includer.css',
    # Font Awesome
  ]

  # Active in production mode only #

  # Compress Javascript.
  js_compression  :closure
  # Compress/minify CSS.
  css_compression :sass
  # Caches JS/CSS on startup.
  prebuild true

end
=end