post '/:group_id/file/upload/create', auth: [] do |group_id|

  @group = @user.groups.find(group_id)

  @group.touch

  enc_key = JSON.parse(Base64.strict_decode64(params[:keys]))

  selector = {
    filename: params[:filename].slug,
    key: enc_key['message'],
    keys: enc_key['keys'],
    owner_id: @user.id.to_s,
    type: params[:type],
    size: params[:size],
    image_size: params[:image_size]
  }

  upload = if params[:mode] == 'thumbnail'

    original = @group.attachments.find(params[:upload_id])

    thumbnail = @group.thumbnails.create(selector)

    original.thumbnail_id = thumbnail.id.to_s

    original.save!

    thumbnail

  elsif params[:mode] == 'avatar'

    upload = @group.user_avatars.create(selector)

    membership = @user.memberships
      .where(group_id: @group.id).first

    if membership.user_avatar
      membership.user_avatar.destroy
    end

    membership.user_avatar = upload
    membership.save!

    upload

  elsif params[:mode] == 'group_avatar'

    upload = GroupAvatar.create(selector)

    if @group.group_avatar
      @group.group_avatar.destroy
    end

    @group.group_avatar = upload

    @group.palette = [params[:dominant],
      params[:first_median], params[:second_median]]

    @group.save!

    upload

  else

    upload = @group.attachments.create(selector)
    upload.save!

    upload

  end

=begin
  if params['transfer_id']
    transfer = @group.transfers
    .find(params[:transfer_id])
    transfer.upload_id = upload.id.to_s
    transfer.save!
  end
=end

  dir = File.join(settings.upload_path, upload.id)
  FileUtils.mkdir(dir)

   EventAnalysis.track @user, 'User started uploading file'

  { status: 'ok',
    upload: {
      id: upload.id.to_s,
      key: upload.key_for_user(@user),
      size: upload.size,
      filename: upload.filename,
      type: upload.type
    }
  }.to_json

end

post '/:group_id/file/upload/append', auth: [] do |group_id|

  group = @user.groups.find(group_id)

  id = params[:id]
  chunk = params[:chunk]
  
  upload = begin
    group.uploads.find(id)
  rescue Mongoid::Errors::DocumentNotFound
    return { status: 'error' }.to_json
  end

  if params[:last]

    upload.complete = true
    upload.save!
    
    if upload.is_a?(GroupAvatar)

      group = upload.group
      
      MagicBus::Publisher.scatter(group, :update, :group_avatar) do |user|
        AvatarGenerator.generate(upload, user)
      end

       group.users.each do |user|

         next if user.id.to_s == @user.id.to_s

         user.notify({
           action: :group_picture_update,
           create: {
             actor_ids: [@user.id.to_s]
           }
         }, group)

      end

    elsif upload.is_a?(UserAvatar)

      group = upload.group
      
      MagicBus::Publisher.scatter(group, :update, :user_avatar) do |user|
        AvatarGenerator.generate(upload, user)
      end

    end

  end

  data = params[:data][:tempfile].read

  dir = File.join(settings.upload_path, id)

  unless File.directory?(dir)
    raise "Invalid upload ID."
  end

  file = File.join(dir, chunk)

  File.open(file, 'w+') do |f|
    f.write(data)
  end
  
  { status: 'ok' }.to_json

end

get '/:group_id/file/download/:id', auth: [] do |group_id, id|

  @group = Group.find(group_id)

  id = params[:id]
  
  upload = begin
    @group.uploads.find(id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'file_not_found'
  end
  
  dir = File.join(settings.upload_path, id)

  unless File.directory?(dir)
    error 404, 'file_not_found'
  end
  
  chunk_files = File.join(dir, '*')
  chunks = Dir.glob(chunk_files).count
  
  unless chunks > 0
    error 404, 'file_not_found'
  end
  
   EventAnalysis.track @user, 'User started downloading file'
   
   file = File.join(settings.upload_path, id, '0')
   
  {
    status: 'ok',
    chunks: chunks,
    type: upload.type,
    content: File.read(file)
  }.to_json

end

get '/:group_id/file/download/:id/:chunk', auth: [] do |group_id, id, chunk|

  @group = Group.find(group_id)

  file = File.join(settings.upload_path, id, chunk)

  # Find the record in the DB.
  upload = @group.uploads.find(id)

  # Set the request headers.
  unless upload.type.to_s == ''
    content_type(upload.type)
  end

  # If not a media, and not in AJAX call,
  # return the file as an attachment.
  if !upload.is_media? && !request.xhr?
    attachment
  end

  File.read(file)

end
