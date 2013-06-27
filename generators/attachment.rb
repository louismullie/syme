class AttachmentGenerator
  
  def self.generate(post, user)
        
    return false unless post.attachment
    
    upload = post.attachment
    
    thumbnail = generate_thumbnail(upload, user)
    
    {
      # General file information.
      id: upload.id.to_s,
      filename: upload.filename,
      size: upload.size,
      key: upload.key_for_user(user),
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
    
    {
      id: thumbnail.id.to_s,
      filename: thumbnail.filename,
      size: thumbnail.size,
      key: thumbnail.key_for_user(user),
      type: thumbnail.type
    }
  
  end

end
