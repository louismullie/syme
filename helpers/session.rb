require 'digest'
require 'openssl'

def random_bytes(bytes)
  OpenSSL::Random.random_bytes(bytes).unpack("H*")[0]
end

def sha256_hash(h)
 Digest::SHA256.hexdigest(h)
end

def mod_pow(a, n, m)

  r = 1

  while true
    r = r * a % m if n[0] == 1
    n >>= 1
    return r if n == 0
    a = a * a % m
  end

end

def calc_k(n, g)

  n_hex, g_hex = n.to_i.to_s(16), g.to_i.to_s(16)
  n_len = n_hex.length + (n_hex.length.odd? ? 1 : 0)

  hashin = '0' * (n_len - n_hex.length) + n_hex \
         + '0' * (n_len - g_hex.length) + g_hex

  sha256_hash(hashin).hex % n

end

def calc_x(email, password, salt)

  salt_hex = salt.to_i.to_s(16)
  salt_pad = shex.length.odd? ? '0' : ''

  auth = sha256_hash(email + ':' + password)
  sha256_hash(salt_pad + salt_hex + auth).hex

end

def calc_u(aa, bb, n)

  aahex = aa.to_i.to_s(16)
  bbhex = bb.to_i.to_s(16)

  hashin = '0' * (256 - aahex.length) + aahex \
         + '0' * (256 - bbhex.length) + bbhex

  sha256_hash(hashin).hex

end

def srp_params

  g = 2

  n = ("eeaf0ab9adb38dd69c33f80afa8fc5e86072618775ff3c0b9ea2314c9c25657" +
  "6d674df7496ea81d3383b4813d692c6e0e0d5d8e250b98be48e495c1d6089da" +
  "d15dc7d7b46154d6b6ce8ef4ad69b15d4982559b297bcf1885c529f566660e5" +
  "7ec68edbc3c05726cc02fd4cbf4976eaa9afd5138fe8376435b9fc61d2fc0eb06e3").hex

  k = calc_k(n, g)

  [n, g, k]

end

def decrypt_params(params)
  
  return params
  
=begin
  return params if !params[:encrypted]
  
  error 401 if !session[:key]
  
  # Cheap way to sanitize the JSON input.
  data = JSON.parse(params[:data]).to_json
  
  plain = context.eval("sjcl.decrypt('#{session[:key]}', '#{data}');")
=end

=begin
    data = JSON.parse(params[:data])

    logger.info data
  
    key = PBKDF2.new do |p| 
      p.password = 'password'
      p.salt = Base64.strict_decode64(data['salt'])
      p.iterations = data['iter']
    end
  
    cipher, mode, ks = data['cipher'],
      data['mode'], data['ks']
  
    settings = "#{cipher}-#{ks}-#{mode}"
    cipher = OpenSSL::Cipher.new(settings)
  
    cipher.decrypt
  
    cipher.key = key.bin_string
    cipher.iv = Base64.strict_decode64(data['iv'])
  
    ct = Base64.strict_decode64(data['ct'])
  
    plain = begin
      cipher.update(ct) + cipher.final
    rescue OpenSSL::Cipher::CipherError
      raise "Error during decryption."
    end
=end

=begin
  hash = JSON.parse(plain)
  
  Hash[hash.map{ |k, v| [k.to_sym, v] }]
=end

end

def encrypt_response(response)
  
  # context.eval("sjcl.encrypt('#{session[:key]}', '#{response}');")
  
  response
  
end