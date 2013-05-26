module Upload::Detectable

  # MIME types for image, audio and video files.
  MimeTypes = {
    image: ['image/gif', 'image/jpeg', 'image/pjpeg',
    'image/png', 'image/svg+xml', 'image/tiff'],
    audio: ['audio/basic', 'audio/L24', 'audio/mp4',
      'audio/mpeg', 'audio/ogg', 'audio/vorbis',
    'audio/vnd.rn-realaudio', 'audio/webm'],
    video: ['video/mpeg', 'video/mp4', 'video/quicktime',
    'video/webm', 'video/x-ms-wmv', 'video/x-flv']
  }

  # Map extensions to mime types.
  ExtToMime  = Rack::Mime::MIME_TYPES.merge({
    '.md' => 'text/plain'
  })
  
  # Get apparent mime from file extention.
  def mime_type
    ExtToMime[File.extname(filename).downcase]
  end

  # Does the attachment have an media MIME?
  def is_media?
    is_video? || is_audio? || is_image?
  end

  # Does the attachment have an image MIME?
  def is_image?; matches_type :image; end
  # Does the attachment have a video MIME?
  def is_video?; matches_type :video; end
  # Does the attachment have an audio MIME?
  def is_audio?; matches_type :audio; end

  # Does the attachment fit as a valid image,
  # video or audio file, based on its MIME
  # type and its file extension.
  def matches_type(type)
    MimeTypes[type].include?(mime_type)
  end

end