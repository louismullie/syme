# Helper functions that help in the testing of database-related events

if settings.environment == :development

  def populate_timeline
    # Previous year
    (2010..2012).each do |year|
      (1..12).each do |month|
        post = @group.posts.create( owner_id: @user.id, content: "#{Date::MONTHNAMES[month]} #{year}" )
        post.update_attribute( :created_at, Time.new(year, month) )
      end
    end

    # Current year
    year = 2013
    (1..3).each do |month|
      post = @group.posts.create( owner_id: @user.id, content: "#{Date::MONTHNAMES[month]} #{year}" )
      post.update_attribute( :created_at, Time.new(year, month) )
    end
  end

end