require 'digest'
require 'openssl'

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
  
  return response
  
=begin
  context.eval("sjcl.encrypt('#{session[:key]}', '#{response}');")
  
  response
=end

end