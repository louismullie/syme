module Upload::Storable

  def destroy
    if thumbnail_id
      thumbnail = group.uploads.find(thumbnail_id)
      thumbnail.destroy
    end
    dir = File.join('uploads', id.to_s)
    `srm -r #{dir}`
    super
  end

end
