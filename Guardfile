haml_config = {
  input: './views',
  output: './.hbs',
  default_ext: 'hbs',
  run_at_start: true
}

guard 'haml', haml_config do
  watch(/^views\/.+(\.haml)/)
end

hbs_config = {
  input: './.hbs/views',
  output_folder: './app/js/app/templates',
  register_partials: true,
  run_at_start: true
}

guard 'steering', hbs_config do
  watch(/^\.hbs\/views\/.+\.hbs$/)
end