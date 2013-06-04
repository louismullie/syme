post '/:group/post/create', auth: [] do |group|

  @group = Group.where(name: group).first

  message = JSON.parse(params[:encrypted_content])
  mentions = JSON.parse(params[:mentioned_users])

  upload = if !(upload_id = params[:upload_id]).blank?
    @group.uploads.find(upload_id)
  end
  
  post = @group.posts.create(
    owner_id: @user.id,
    content: message['content'],
    keys: message['keys'],
    mentions: mentions,
    upload_id: upload ? upload.id : nil
  )
  
  # post.upload = upload if upload
  
  post.save!
  
  track @user, 'Created a new post'

  content_type :json

  { status: 'ok', id: post.id }.to_json

end

get '/:group/post/:id', auth: [] do |group,id|

  @group = Group.where(name: group).first
  post = @group.posts.find(id)

  content_type :json

  PostGenerator.generate(post, @user).to_json

end

get '/:group/post/lastof/:page', auth: [] do |group, page|

  content_type :json

  @group = Group.where(name: group).first

  return '' if @group.posts.count == 0

  page = @group.posts.page(page.to_i)
  last = @group.posts.desc(:updated_at).last.id

  if !page.last || page.last.id == last
    ''
  else
    PostGenerator.generate(page.last, @user).to_json
  end

end