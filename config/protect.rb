use Rack::Auth::Basic, "Asocial Private Beta" do |username, password|
  [username, password] == ['admin', 'b23~b23~']
end