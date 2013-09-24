# Additional mime types
Rack::Mime::MIME_TYPES.merge!({
  ".eot" => "application/vnd.ms-fontobject",
  ".ttf" => "application/x-font-ttf",
  ".otf" => "font/otf",
  ".svg" => "image/svg+xml",
  ".woff" => "application/x-font-woff"
})