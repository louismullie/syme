# Render partials without layout by default.
set :haml, layout: false

# In-browser templating

# Live reload of templates in browser
set :reload_templates, true

# Setup path to layout.
hbs_path = File.join(root, '.hbs', 'views')
set :layout_path, File.join(hbs_path, 'layout.hbs')

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
end)