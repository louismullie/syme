get '/users/:user_id/groups/:group_id', auth: [] do |user_id, group_id|

  group = begin
    @user.groups.find(group_id)
  rescue
    error 404, 'group_not_found'
  end

  posts = group.posts.page(1)

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

  posts = group.posts

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

  posts = [group.posts.find(post_id)]

  content_type :json
  FeedGenerator.generate(posts, @user, group).to_json

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