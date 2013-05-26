module Upload::Storable

  def delete
    if thumbnail_id
      thumbnail = group.uploads.find(thumbnail_id)
      thumbnail.destroy
    end
    dir = File.join('uploads', id.to_s)
    FileUtils.rm_rf(dir)
    super
  end

end
