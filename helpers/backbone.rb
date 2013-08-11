def get_model(request)
  JSON.parse(request.body.read.to_s).to_struct
end

def empty_response
  status 200
  {}.to_json
end