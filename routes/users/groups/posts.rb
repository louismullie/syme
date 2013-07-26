post '/users/:user_id/groups/:group_id/posts', auth: [] do |user_id, group_id|

  @group = @user.groups.find(group_id)

  @group.touch

  mentions = params[:mentioned_users] || []

  attachment = if !(upload_id = params[:upload_id]).blank?
    begin
      @group.attachments.find(upload_id)
    rescue Mongoid::Errors::DocumentNotFound
      nil
    end
  end

  post = @group.posts.create(
    owner_id: @user.id,
    mentions: mentions,
    content: '', keys: {},
    attachment: attachment
  )

  if attachment
    attachment.post = post
    attachment.save!
  end

  track @user, 'User created post'

  content_type :json

  PostGenerator.generate(post, @user).to_json
  
end

put '/users/:user_id/groups/:group_id/posts/:post_id' do |user_id, group_id, post_id|

  error 400, 'missing_params' if !params[:content]
  
  message = JSON.parse(Base64.strict_decode64(params[:content]))
  
  @group = begin
    @user.groups.find(group_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'group_not_found'
  end
  
  post = begin
    @group.posts.find(post_id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'post_not_found'
  end
  
  if (user_id  != @user.id.to_s)   ||
     (@user.id.to_s != post.owner_id.to_s)
    error 403, 'access_unauthorized'
  end
  
  post.content = message['message']
  post.keys =  message['keys']
  
  post.save!
  
  empty_response
  
end

get '/:group_id/post/:post_id', auth: [] do |group_id, post_id|

  @group = Group.find(group_id)
  
  post = begin
    @group.complete_posts.find(id)
  rescue Mongoid::Errors::DocumentNotFound
    error 404, 'post_not_found'
  end
  
  content_type :json

  PostGenerator.generate(post, @user).to_json

end

get '/:group_id/post/lastof/:page', auth: [] do |group_id, page|

  content_type :json

  @group = Group.find(group_id)

  return '' if @group.complete_posts.count == 0

  page = @group.complete_posts.page(page.to_i)
  last = @group.complete_posts.desc(:updated_at).last.id

  if !page.last || page.last.id == last
    ''
  else
    PostGenerator.generate(page.last, @user).to_json
  end

end

get '/users/:user_id/groups/:group_id', auth: [] do |user_id, group_id|

  group = begin
    @user.groups.find(group_id)
  rescue
    error 404, 'group_not_found'
  end

  posts = group.complete_posts.page(1)

  content_type :json
  FeedGenerator.generate(posts, @user, group).to_json

end

post '/:group_id/page', auth: [] do |group_id|

  group = begin
    @user.groups.find(group_id)
  rescue
    error 404, 'group_not_found'
  end

  page_num, last_timestamp, ignore = params[:page].to_i,
  params[:last_timestamp], [*params[:ignore]]

  year, month = params[:year], params[:month]

  posts = group.complete_posts

  # Narrow post selection.
  if !month.blank?
    posts = posts.in_month(year.to_i, month.to_i)
  elsif !year.blank?
    posts = posts.in_year(year.to_i)
  end

  # Paginate posts.
  selected_posts = posts.page(page_num)

  # Hide displayed posts.
  selected_posts.reject! do |post|
    ignore.include?(post.id)
  end

  content_type :json

  # Return nothing if there are no posts
  return empty_response if selected_posts.count == 0

  # Otherwise
  {
    posts: FeedGenerator.generate_posts(
      selected_posts, @user, last_timestamp),

    last_page: posts.page(page_num + 1).count == 0
  }.to_json

end

# For single-page view, feed with one post.
get '/users/:user_id/groups/:group_id/posts/:post_id', auth: [] do |user_id, group_id, post_id|

  group = begin
    @user.groups.find(group_id)
  rescue
    error 404, 'group_not_found'
  end

  posts = begin
    
    post = group.complete_posts.find(post_id)
    
    if !post.content
      post.destroy; raise
    end
    
    [group.complete_posts.find(post_id)]
    
  rescue
    error 404, 'post_not_found'
  end

  content_type :json
  
  FeedGenerator.generate(posts, @user, group)
    .merge({ single_post: true }).to_json

end

get '/:group_id/archive/:year/?:month?', auth: [] do |group_id, year, month|

  group = begin
    @user.groups.find(group_id)
  rescue
    error 404, 'group_not_found'
  end

  content_type :json

  FeedGenerator.generate(posts, @user)
    .merge(time_scope).to_json

end