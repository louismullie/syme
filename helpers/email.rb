def send_email(to, subject, body)
  
  Pony.mail(:to => to, :via =>:sendmail,
    :from => "contact@joinasocial.com", :subject => subject,
    :headers => { 'Content-Type' => "text/html" }, :body => body)
  
end

def send_email2(a_to_address, a_from_address , a_subject, a_type, a_message)
  begin
    case settings.environment
    when :development                          # assumed to be on your local machine
      Pony.mail :to => a_to_address, :via =>:sendmail,
        :from => a_from_address, :subject => a_subject,
        :headers => { 'Content-Type' => a_type }, :body => a_message
    when :production                         # assumed to be Heroku
      Pony.mail :to => a_to_address, :from => a_from_address, :subject => a_subject,
        :headers => { 'Content-Type' => a_type }, :body => a_message, :via => :smtp,
        :via_options => {
          :address => 'smtp.sendgrid.net',
          :port => 25,
          :authentication => :plain,
          :user_name => ENV['SENDGRID_USERNAME'],
          :password => ENV['SENDGRID_PASSWORD'],
          :domain => ENV['SENDGRID_DOMAIN'] }
    when :test
      # don't send any email but log a message instead.
      logger.debug "TESTING: Email would now be sent to #{to} from #{from} with subject #{subject}."
    end
  rescue StandardError => error
    logger.error "Error sending email: #{error.message}"
  end
end

def send_invite(email, token)
  
  subject = "Join #{@user.get_name} on Asocial"

  message = 

"Hey,

#{@user.get_name} invited you to join his network.
Follow this link to accept the invitation and
register: http://localhost:5000/invite/show/#{token}.

Best,
Asocial"

  # email
  send_email('louis.mullie@gmail.com', subject, message)
  
end

def request_confirm(inviter, invitee, token)
  
  subject = "Integrate #{invitee.get_name} in your group"

  message =

"Hey #{inviter.get_name},
     
#{invitee.get_name} has joined your group on Asocial.
Follow this link to accept to confirm registration:

http://localhost:5000/invite/confirm/#{token}

Best,
Asocial"

  # inviter.email
  send_email('louis.mullie@gmail.com', subject, message)

end


def notify_confirmed(inviter, invitee)
  
  subject = "Integrate #{invitee.get_name} in your group"

  message =

"Hey #{invitee.get_name},
     
#{inviter.get_name} has approved your registration.
Login to your group at http://localhost:5000/

Best,
Asocial"

  # invitee.email
  send_email('louis.mullie@gmail.com', subject, message)

end