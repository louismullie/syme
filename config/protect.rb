if $env == :production
  use Rack::Auth::Basic, "Syme Private Beta" do |username, password|
    [username, password] == ['admin', 'b23~b23~']
  end
end