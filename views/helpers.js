
// SAY_NOTIFICATION

- case notification.action.intern
- when :post

  %b {{notification.user_list}}
  {{t 'notifications.posted_a'}}  
  %a{href: '{{notification.post_link}}'}
    {{t 'notifications.new_post'}}
- when :comment_on_same_post

  %b {{notification.user_list}}
  
  {{t 'notifications.also_commented_on'}}  
  %a{href: '{{notification.comment_link}}'}
  
    {{t 'notifications.a_post'}}
- when :comment_on_own_post

  %b {{notification.user_list}}
  
  {{t 'notifications.commented_on'}}  
  %a{href: '{{notification.comment_link}}'}
    {{t 'notifications.your_post'}}
- when :like

  %b #{user_list}
  {{t 'notifications.liked_your'}}  - if notification.comment_id.nil?
    %a{href: post_link}
      {{t 'notifications.post'}}  - else
    %a{href: comment_anchor}
      {{t 'notifications.comment'}}      
      

// RENDER_NOTIFICATION

- users = notification.actor_ids.map { |owner_id| @group.users.find(owner_id) }
- user_list = users.map { |user| user.get_name }.join_english
- post_link = "post/#{notification.post_id}"
- comment_anchor = "#{post_link}##{notification.comment_id}"
- clear_link = "notifications/#{notification.id}/clear"
- notification_id = "notification-#{notification.id}"

= haml :'feed/notification', locals: { user_list: user_list, post_link: post_link, comment_anchor: comment_anchor, clear_link: clear_link, notification: notification, user: users.first}


// RENDER_POSTS

- last_date = defined?(last_timestamp) ? Time.at(last_timestamp.to_i) : Time.now + 1
- @posts.each do |post|
  - # Show a updated_at date only one time
  - show_updated_at = if post.updated_at.round_to_day < last_date
    - last_date = post.updated_at.round_to_day
    - post.updated_at
  - else
    - false

  = haml :'feed/post', locals: { post: post, show_updated_at: show_updated_at }

