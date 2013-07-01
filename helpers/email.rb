def send_email_to(email, subject, body)

  Pony.mail({
    :to => email,
    :from => "contact@joinasocial.com",
    :subject => subject,
    :headers => { 'Content-Type' => "text/html" },
    :body => body,
    :via => :smtp,
    :via_options => {
      :address        => 'smtp.mandrillapp.com',
      :port           => '587',
      :user_name      => 'louis.mullie@gmail.com',
      :password       => 'tjCX49k-tDIYzmqnW0ZjYw',
      :authentication => :plain,
      :domain         => "localhost.localdomain"
    }
  }) unless settings.environment == :development
  
end

def send_invite(email, token)
  
  subject = "Join #{@user.full_name} on Asocial"

  message = 

"Hey,

#{@user.full_name} invited you to join his network.
Follow this link to register and accept his invitation: http://asocial.io

Best,
Asocial"

  # email
  send_email_to(email, subject, message)
  
end

def request_confirm(invite)
  
  invitee, inviter = invite.invitee, invite.inviter
  
  subject = "Accept #{invitee.full_name} in #{invite.group.name}"

  message =

"Hey #{inviter.full_name},
     
#{invitee.full_name} has joined your group on Asocial.
Login to your group at http://asocial.io to approve him.

Best,
Asocial"

  # inviter.email
  send_email_to(inviter.email, subject, message)

end


def notify_confirmed(invite)
  
  invitee, inviter = invite.invitee, invite.inviter
  
  subject = "Your request to join #{invite.group.name} was approved"

  message =

"Hey #{invitee.full_name},
     
#{inviter.full_name} has approved your registration.
Login to your group at http://asocial.io to start sharing.

Best,
Asocial"

  # invitee.email
  send_email_to(invitee.email, subject, message)

end