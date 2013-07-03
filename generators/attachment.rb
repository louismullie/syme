class AttachmentGenerator
  
  def self.generate(post, user)
        
    return false unless post.attachment
    
    upload = post.attachment
    
    current_key = upload.key_for_user(user)
    thumbnail = generate_thumbnail(upload, user)
  
    content = Base64.strict_encode64({
      message: post.attachment.key,
      keys: {
        user.id.to_s => current_key
      },
      senderId: post.owner.id.to_s
    }.to_json)
    
    {
      # General file information.
      id: upload.id.to_s,
      filename: upload.filename,
      size: upload.size,
      keys: content,
      type: upload.type,
      
      # MIME type information.
      is_media: upload.is_media?,
      is_video: upload.is_video?,
      is_image: upload.is_image?,
      is_audio: upload.is_audio?,
      
      # Image information.
      image_size: upload.image_size,
      thumbnail: thumbnail
      
    }

  end

  def self.generate_thumbnail(upload, user)
    
    return {} unless upload.thumbnail
    
    thumbnail = upload.thumbnail 
    
    current_key = thumbnail.key_for_user(user)
    
    content = Base64.strict_encode64({
      message: thumbnail.key,
      keys: {
        user.id.to_s => current_key
      },
      senderId: thumbnail.owner.id.to_s
    }.to_json)
    
    {
      id: thumbnail.id.to_s,
      filename: thumbnail.filename,
      size: thumbnail.size,
      keys: content,
      type: thumbnail.type
    }
  
  end

end
