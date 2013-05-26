module Upload::Resizable

  # Add thumbnail data to an image upload.
  def add_thumbnail(upload)
    update_attribute :thumbnail_id, upload.id.to_s
  end

  def thumbnail; Upload.find(thumbnail_id); end

  # True if the image has a thumbnail.
  def has_thumbnail?; !thumbnail_id.nil?; end
  
end
