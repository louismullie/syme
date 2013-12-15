require 'rufus-scheduler'
require './config/mongoid'
require './models/user'

EMAIL_SALT = '"a$$#!%@&Fe39n#?*4n4C$ni'
require './helpers/email'

settings.environment = :production

scheduler = Rufus::Scheduler.new

one_day = 60 * 60 * 24

def less_than(&block)
  { "$lte" => block.call }
end

# 1) 24h / 24h
# 2) 72h / 72h
# 3) 24h / 48h
# 4) 24h / 48h

Emails = {
  
  confirm_account_reminder: {
    
    type: User,
    
    selector: {
      confirmed: false,
      created_at: less_than { Time.now - 30 }
    },
    
    threshold: -> { Time.now - 10 },
    max_times: 2
    
    template: 'send_confirm_email'
    
  },
  
  account_activity_reminder: {
    
    type: User,
    
    selector: {
      confirmed: true,
      last_seen: less_than { Time.now - 30 }
    },
       
    threshold: -> { Time.now - 10 },
    max_times: 2
    
    template: 'send_activity_email'
    
  },
  
  invite_accept_reminder: {
    
    type: Invitation,
    
    selector: {
      state: 1,
      created_at: less_than { Time.now - 30 }
    },
    
    threshold: -> { Time.now - 10 },
    max_times: 2
    
    template: 'send_invite_reminder'
    
  },
  
  invite_confirm_reminder: {
    
    type: Invitation,
    
    selector: {
      state: 1,
      created_at: less_than { Time.now - 30}
    },
    
    threshold: -> { Time.now - 10 },
    max_times: 2
    
    template: 'request_confirm'
    
  }
  
}

def send_emails(type)
  
  email = Emails[type].dup
  
  email[:selector][:created_at] =
  email[:selector][:created_at].call
  
  objs = email[:type].where(email[:selector])
  
  
  objs.each do |obj|
    
    emails_sent = obj.emails_sent
    
    obj.emails_sent = emails_sent || {}
    
    last_email_sent = emails_sent[type.to_s]
    
    puts last_email_sent
    
    if !last_email_sent || last_email_sent[:time] < email[:threshold].call
      
      emails_sent[type.to_s] ||= {}
      emails_sent[type.to_s][:time] = Time.now
      emails_sent[type.to_s][:tries] ||= 0
    
      next if emails_sent[type.to_s][:tries] > email[:max_tries]
      
      send(email[:template].intern, obj)
      
      emails_sent[type.to_s][:tries] += 1
      
      obj.emails_sent = emails_sent
      
      obj.save!
      
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