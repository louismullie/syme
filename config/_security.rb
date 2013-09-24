OriginWhitelist = ['chrome-extension://kebgjahkgfpaeidbimpiefobehkjmani']

set :protection,
     except: [:http_origin, :remote_token, :frame_options],
     origin_whitelist: OriginWhitelist

set :show_exceptions, false
set :raise_errors, false