get '/:group', auth: [] do |group|

  @group = Group.where(name: group).first

  # Pass if 404
  pass if @group.nil?

  content_type :json

  posts = @group.posts.page(1)

  FeedGenerator.generate(posts, @user, @group).to_json

end

post '/:group/page', auth: [] do |group|

  @group = Group.where(name: group).first

  page, last_timestamp, ignore = params[:page],
  params[:last_timestamp], [*params[:ignore]]

  year, month = params[:year], params[:month]

  posts = @group.posts

  # Narrow post selection.
  if !month.nil? && !month.empty?
    posts = posts.in_month(year.to_i, month.to_i)
  elsif !year.nil? && year.empty?
    posts = posts.in_year(year.to_i)
  end

  # Paginate posts.
  posts = posts.page(page.to_i)

  # Hide displayed posts.
  posts.reject! do |post|
    ignore.include?(post.id)
  end

  content_type :json


  if posts.count == 0
    {}.to_json
  else
    FeedGenerator.generate_posts(
      posts, @user, last_timestamp).to_json
  end

end

get '/:group/archive/:year/?:month?', auth: [] do |group, year, month|

  @group = Group.where(name: group).first

  content_type :json

  FeedGenerator.generate(posts, @user)
    .merge(time_scope).to_json

end
