haml_config = {
  input: './views',
  output: './.hbs',
  default_ext: 'hbs',
  run_at_start: true
  # ugly: true
}

guard 'haml', haml_config do
  watch(/^.+(\.haml)/)
end

hbs_config = { 
  input: './.hbs/views',
  output_folder: './public/js/asocial/templates',
  register_partials: true,
  run_at_start: true 
} 

guard 'steering', hbs_config do
  watch(/^\.hbs\/views\/.+\.hbs$/)
end