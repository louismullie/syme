OriginWhitelist = ['chrome-extension://kebgjahkgfpaeidbimpiefobehkjmani']

#set :protection,
#     except: [:http_origin, :frame_options],
#     origin_whitelist: OriginWhitelist

enable :protection

EMAIL_SALT = '"a$$#!%@&Fe39n#?*4n4C$ni'

if settings.environment == :production
  
  # Setup a strict CSP to discourage XSS.
  require 'content-security-policy'

  default = 'localhost:5000 getsyme.com:81'

  use ContentSecurityPolicy, directives: {
    # 'default-src' => settings.secure ? 'https: ' : '*',
    'script-src' => default,
    'style-src' => default,
    'object-src' => default,
    'font-src' => default,
    'connect-src' => default,
    # 'report-uri' => '/route/for/report'
    # Leave media-src, img-src and frame-src.
  }

  require 'active_support'
  require 'rack/attack'

  # Setup server-side throttling.
  use Rack::Attack

  Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new

  Rack::Attack.throttle('login/email', limit: 6, period: 60) do |req|
    req.params['email'] if req.params['email']
  end

end