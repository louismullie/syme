require 'rufus-scheduler'
require './config/mongoid'
require './models/user'

EMAIL_SALT = '"a$$#!%@&Fe39n#?*4n4C$ni'
INFINITY = 999999999999

require './helpers/email'

settings.environment = :production

scheduler = Rufus::Scheduler.new

def less_than(&block)
  return -> { { "$lte" => yield } }
end

# 1) 24h / 24h
# 2) 72h / 72h
# 3) 24h / 48h
# 4) 24h / 48h

def one_day
  60 * 60 * 24
end

Emails = {
  
  confirm_account_reminder: {
    
    type: User,
    
    selector: { confirmed: false },
    
    time_selector: {
      
      field: :created_at,
      time: less_than { Time.now - one_day }
        
    },
    
    threshold: one_day,
    max_tries: 3,
    
    template: 'send_confirm_email'
    
  },
  
  account_activity_reminder: {
    
    type: User,
    
    selector: { confirmed: true },
    
    time_selector: {
      
      field: :last_seen,
      time: less_than { (Time.now - one_day).to_datetime }
        
    },
    
    block_selector: ->(user) { user.notifications.size > 0 },
       
    threshold: one_day,
    max_tries: INFINITY,
    
    template: 'send_activity_email'
    
  },
  
  invite_accept_reminder: {
    
    type: Invitation,
    
    selector: { state: 1 },
    
    time_selector: {
      
      field: :created_at,
      time: less_than { Time.now - one_day }
        
    },
    
    threshold: one_day,
    max_tries: 3,
    
    template: 'send_invite_reminder'
    
  },
  
  invite_confirm_reminder: {
    
    type: Invitation,
    
    selector: { state: 2 },
    
    time_selector: {
      
      field: :created_at,
      time: less_than { Time.now - one_day }
        
    },
    
    threshold: one_day,
    max_tries: 3,
    
    template: 'request_confirm'
    
  }
  
}

def send_emails(type)
  
  email = Emails[type].dup
  
  time_selector = {
    email[:time_selector][:field] =>
    email[:time_selector][:time].call
  }
  
  selector = email[:selector].merge(time_selector)
  objs = email[:type].where(selector)
  
  if email[:block_selector]
    objs = objs.select(&email[:block_selector])
  end
  
  puts "#{objs.size} objects for #{selector}"
  
  objs.each do |obj|
    
    emails_sent = obj.emails_sent
    
    obj.emails_sent = emails_sent || {}
    
    last_email_sent = emails_sent[type.to_s]
    
    puts "last email sent: #{last_email_sent}"
    
    if !last_email_sent || (last_email_sent['time'] && 
       (Time.now - last_email_sent['time'] > email[:threshold]))
      
      emails_sent[type.to_s] ||= {}
      emails_sent[type.to_s]['time'] = Time.now
      emails_sent[type.to_s]['tries'] ||= 0
    
      if emails_sent[type.to_s]['tries'] >= email[:max_tries]
        puts "skipping sending email due to max tries"
        next
      end
      
      puts "sending email to #{obj.email}"
      send(email[:template].intern, obj)
      
      emails_sent[type.to_s]['tries'] += 1
      
      # Use atomic operation to prevent triggering callbacks
      obj.set :emails_sent, emails_sent
      
    end
  
  end

end

scheduler.every('3s') do
  
  puts "Checking for users who haven't confirmed their account ------"
  send_emails :confirm_account_reminder
  
  puts "Checking for users who have confirmed but haven't recently been active ------"
  send_emails :account_activity_reminder
  
  puts "Checking for users who haven't accepted an invitation ------"
  send_emails :invite_accept_reminder
  
  puts "Checking for users who haven't confirmed an invitation ------"
  send_emails :invite_confirm_reminder
  
end


# scheduler.every '1s' do
  
  # puts "Deleting incomplete resources -----------------"
  # 
  # selector = { complete: false, created_at: { "$lte" => Time.now - one_min * 5 } }
  # special_selector = { ack_create: false, created_at: { "$lte" => Time.now - one_min * 5 } }
  # 
  # User.where(selector).delete_all
  # Group.where(special_selector).delete_all
  # Post.where(selector).delete_all
  # Comment.where(selector).delete_all
  # Upload.where(selector).delete_all
  
# end

scheduler.join