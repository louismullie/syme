require 'rufus-scheduler'
require './config/mongoid'
require './models/user'

scheduler = Rufus::Scheduler.new

scheduler.every '1s' do
  
  puts "-----------------"
  
  incomplete_users = User.where(complete: false).to_a
  
  #incomplete_users.each do |incomplete_user|
  #  if incomplete_user.created_at - Time.now > 1000
  #    puts incomplete_user.created_at - Time.now
  #  end
  #end
  
  incomplete_groups = Group.where(ack_create: false)
  incomplete_posts = Post.where(complete: false)
  incomplete_commments = Comment.where(complete: false)
  incomplete_uploads = Upload.where(complete: false)
  
  complete_invitations = Invitation.where()
  
end

scheduler.join