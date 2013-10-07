# Render partials without layout by default.
set :haml, layout: false

# In-browser templating

# Live reload of templates in browser
set :reload_templates, true

# Setup path to layout.
set :views_path, File.join(root, 'app', 'js', 'views')
set :layout_path, File.join(settings.views_path, 'layout.hamlbars')

# Templating at compilation time

# Setup paths for Sprockets
set :assets_path, File.join(root, 'public', 'assets')

# Setup sprockets for compilation.
set :sprockets, (Sprockets::Environment.new(root) do |env|

  env.logger = Logger.new(STDOUT)
  env.append_path 'app/js'
  env.append_path 'app/css'
  env.js_compressor = Closure::Compiler.new
  env.css_compressor = :sass
  env.append_path HandlebarsAssets.path

end)