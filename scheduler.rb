require 'rufus-scheduler'
require './config/mongoid'
require './models/user'

scheduler = Rufus::Scheduler.new

one_day = 60 * 60 * 24
one_min = 60

scheduler.every '1s' do
  
  puts "Deleting incomplete resources -----------------"
  
  selector = { complete: false, created_at: { "$lte" => Time.now - one_min * 5 } }
  special_selector = { ack_create: false, created_at: { "$lte" => Time.now - one_min * 5 } }
  
  User.where(selector).delete_all
  Group.where(special_selector).delete_all
  Post.where(selector).delete_all
  Comment.where(selector).delete_all
  Upload.where(selector).delete_all
  
end

scheduler.every '5s' do
  
  puts "Checking for users who haven't confirmed -------"
  
  users = User.where( { confirmed: false, created_at: { "$lte" => Time.now - one_day } })
  
  users.each do |user|
    user.emails_sent = users.emails_sent || {}
    user.emails_sent[:confirm_email_reminder] = true
    send_confirm_email_reminder(user)
  end
  
  puts "Checking for users who have confirmed but haven't recently been active ------"
  
  users = Users.where( { confirmed: true, last_seen: { "$lte" => Time.now - one_day * 3 }})
  
  users.each do |user|
    user.emails_sent = users.emails_sent || {}
    user.emails_sent[:login_reminder] = true
    send_login_reminder(user)
  end
  
  puts "Checking for users who haven't accepted an invitation ------"
  
  invitations = Invitations.where(state: 1, created_at: { "$lte" => Time.now - one_day } })
  
  users.each do |user|
    user.emails_sent = users.emails_sent || {}
    user.emails_sent[:accept_invitation_reminder] = true
    send_accept_invitation_reminder(user)
  end
  
  puts "Checking for users who haven't confirmed an invitation ------"
  
  invitations = Invitations.where(state: 1, created_at: { "$lte" => Time.now - one_day } })
  
  users.each do |user|
    user.emails_sent = users.emails_sent || {}
    user.emails_sent[:confirm_invitation_reminder] = true
    send_confirm_invitation_reminder(user)
  end
  
end

scheduler.join