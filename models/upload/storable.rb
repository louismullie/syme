module Upload::Storable

  def destroy
    thumbnail.destroy if thumbnail
    dir = File.join('../uploads', id.to_s)
    `srm -r #{dir}`
    super
  end

end