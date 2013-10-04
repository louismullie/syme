OriginWhitelist = ['chrome-extension://kebgjahkgfpaeidbimpiefobehkjmani']

set :protection,
     except: [:http_origin, :remote_token, :frame_options],
     origin_whitelist: OriginWhitelist

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

=begin
  # Enable token protection against CSRF.
  require 'rack/csrf'

  use Rack::Csrf, skip: [
    # Allow registration without CSRF.
    'POST:/users',
    # Allow login without CSRF.
    'POST:/users/current/sessions'
  ]
=end

  require 'active_support'
  require 'rack/attack'

  # Setup server-side throttling.
  use Rack::Attack

  Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new

  Rack::Attack.throttle('login/email', limit: 6, period: 60) do |req|
    req.params['email'] if req.path =~ /login\/1/ && req.post?
  end

end