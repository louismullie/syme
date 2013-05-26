post '/:group/file/upload/create', auth: [] do |group|

  @group = Group.where(name: group).first

  upload = @group.uploads.create(
    filename: params[:filename].slug,
    keys: JSON.parse(params[:keys]),
    owner_id: @user.id,
    type: params[:type],
    size: params[:size],
    image_size: params[:image_size],
  )

  id = upload.id.to_s
  dir = File.join('uploads', id)
  FileUtils.mkdir(dir)

  if params[:mode] == 'thumbnail'
    original = @group.uploads.find(
      params[:upload_id])
    original.add_thumbnail(upload)
  elsif params[:mode] == 'avatar'
    membership = @user.memberships
      .where(group_id: @group.id).first
    if membership.avatar_id
      @group.uploads.find(membership.avatar_id).delete
    end
    membership.avatar_id = upload.id.to_s
    membership.save!
  elsif params[:mode] == 'group_avatar'
    @group.avatar_id = upload.id.to_s
    @group.palette = [params[:dominant], params[:first_median], params[:second_median]]
    @group.save!
  end

=begin
  if params['transfer_id']
    transfer = @group.transfers
    .find(params[:transfer_id])
    transfer.upload_id = upload.id.to_s
    transfer.save!
  end
=end

  content_type :json

  { status: 'ok',
    upload: {
      id: upload.id,
      key: upload.key_for_user(@user),
      size: upload.size,
      filename: upload.filename,
      type: upload.type
    }
  }.to_json

end

post '/:group/file/upload/append', auth: [] do |group|

  @group = Group.where(name: group).first

  logger.info params

  id = params[:id]
  chunk = params[:chunk]

  data = params[:data][:tempfile].read

  dir = File.join('uploads', id)

  unless File.directory?(dir)
    raise "Invalid upload ID."
  end

  file = File.join(dir, chunk)

  File.open(file, 'w+') do |f|
    f.write(data)
  end

  content_type :json

  { status: 'ok' }.to_json

end

get '/:group/file/download/:id', auth: [] do |group, id|

  @group = Group.where(name: group).first

  id = params[:id]
  upload = @group.uploads.find(id)

  raise "Can't find upload." unless upload

  dir = File.join('uploads', id)

  chunk_files = File.join(dir, '*')
  chunks = Dir.glob(chunk_files).count

  content_type :json

  { status: 'ok',
    chunks: chunks,
    type: upload.type }.to_json

end

get '/:group/file/download/:id/:chunk', auth: [] do |group, id, chunk|

  @group = Group.where(name: group).first

  file = File.join('uploads', id, chunk)

  # Find the record in the DB.
  upload = @group.uploads.find(id)

  # Set the request headers.
  unless upload.type.length == 0
    content_type(upload.type)
  end

  # If not a media, and not in AJAX call,
  # return the file as an attachment.
  if !upload.is_media? && !request.xhr?
    attachment
  end

  File.read(file)

end
