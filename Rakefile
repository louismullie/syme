require 'rspec/core/rake_task'
include Rake::DSL

task default: :spec

RSpec::Core::RakeTask.new do |t|
   t.pattern = "./specs/*.rb"
end