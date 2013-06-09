#if $env == :production
#  use Rack::Auth::Basic, "Asocial Private Beta" do |username, password|
#    [username, password] == ['admin', 'b23~b23~']
#  end
#end

# Doesn't work with compression: https://github.com/rstacruz/sinatra-assetpack/issues/68