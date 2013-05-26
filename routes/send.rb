def send_msg(id, hash)

  client = settings.channels[id.to_s]
  token = hash.to_json
  
  return false unless client
  
  client.push(token)
  
  true
  
end

def send_data(id, hash)
  data = { action: :send, model: :file, data: hash }
  send_msg(id, data)
end

post '/send/file' do

  @group = @user.groups.where(name: params[:group]).first
  
  recipient_id = params['recipient_id']
  sender_id = @user.id.to_s
  client = settings.channels[recipient_id]

  if !client
    
    send_data(sender_id, {
      action: :refuse,
      reason: t(:'send.recipient_not_online')
    })

  else
    
    transfer = @group.transfers.create(
      recipient_id: recipient_id,
      sender_id: @user.id.to_s
    )

    send_data(recipient_id, {
      action: :request,
      transfer_id: transfer.id,
      filename: params['file'],
      sender_name: @user.get_name
    })

  end

end


post '/send/file/refuse' do

  @group = @user.groups.where(name: params[:group]).first
  
  transfer_id = params['transfer_id']
  transfer = @group.transfers.find(transfer_id)
  
  send_data(transfer.sender_id, {
    action: :refuse,
    reason: t(:'send.recipient_refused')
  })

  transfer.destroy

end


post '/send/file/accept' do
  
  @group = @user.groups.where(name: params[:group]).first

  transfer_id = params['transfer_id']
  transfer = @group.transfers.find(transfer_id)

  upload = Upload.create(
    file: params['file'],
    size: params['size']
  )

  transfer.upload_id = upload.id.to_s

  send_data(transfer.sender_id, {
    action: :accept,
    transfer_id: transfer_id,
    recipient_id: transfer.recipient_id
  })

end

post '/send/file/start' do
  
  @group = @user.groups.where(name: params[:group]).first
  
  transfer_id = params['transfer_id']
  transfer = @group.transfers.find(transfer_id)
  upload = transfer.upload
  recipient = @group.users.find(transfer.recipient_id)
  
  send_data(transfer.recipient_id, {
    action: :start,
    transfer_id: transfer_id,
    upload: {
      id: upload.id,
      filename: upload.filename,
      size: upload.size,
      key: upload.key_for_user(recipient)
    }
  })

end
