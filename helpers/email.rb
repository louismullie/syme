def send_email_to(email, subject, body)

  #Pony.mail({
  #  :to => email,
  #  :from => "team@getsyme.com",
  #  :subject => subject,
  #  :headers => { 'Content-Type' => "text/html" },
  #  :body => body,
  #  :via => :smtp,
  #  :via_options => {
  #    :address        => 'smtp.mandrillapp.com',
  #    :port           => '587',
  #    :user_name      => 'louis.mullie@gmail.com',
  #    :password       => 'tjCX49k-tDIYzmqnW0ZjYw',
  #    :authentication => :plain,
  #    :domain         => "localhost.localdomain"
  #  }
  #})
  
end

def send_beta_invite(email, token)
  
  subject = "You've been signed up for an invite"
  
  message = "<p>Hello,</p>
  <p>You recently asked us to remind you when Asocial is ready. This is just to confirm that your email is registered and that you'll be the first to know when Asocial is out.</p>
  <p>Do you have any questions or comments? We'd love to hear from you. Don’t hesitate to get in touch by replying to this email.</p>
  <p>Sincerely,</p>
  <p>The Syme Team</p>
  <p>Jon, Chris and Louis</p>
  <p><a href='http://www.getsyme.com'>www.getsyme.com</a></p>"
  
  send_email_to(email, subject, message)
  
end

def send_beta_welcome(email, token)
  
  subject = "Welcome to Syme beta"

  message =
  "<p>Hi there,</p>
  
  <p>You’re in! Welcome to Syme, the encrypted social network.</p>
  
  <p>All you need to do is to <a href='CHROME EXTENSIONSTORE'> install Syme</a> to get started.</p>

  <p>We’re glad to have you on board. Don’t hesitate to get in touch if you have any questions or comments.</p>

  <p>Sincerely,</p>

  <p>The Syme Team</p>
  <p>Jon, Chris and Louis</p>
  <p><a href='http://www.getsyme.com'>www.getsyme.com</a></p>

  <p>Get in touch: <a href='mailto:team@getsyme.com'>Email</a> |
  <a href='http://www.facebook.com/syme'>Facebook</a> |
  <a href='http://www.twitter.com/symeapp'>Twitter</a></p>
   
  <p>You received this email because you requested to join the waiting list for Asocial beta. If you have not, let us know by replying 'unsubscribe' to this e-mail.</p>"
  
end

def send_email_confirm(email, token)
  
  subject = "Confirm your Syme account"
  
  message = 
  
  "Hey #{@user.full_name},

  Welcome to Syme, the encrypted social network. All we need to do is make sure this is really your email address.

  <p><a href='www.getsyme.com/verify/#{@user.id}'>Veriy my account</a></p>

  <p>If you think you received this message by mistake, just reply 'unsubscribe' to this e-mail and we won't send you any more notifications.</p>
  "
  
end

def send_invite(email, token)
  

  subject = "Join #{@user.full_name} in a group on Syme"
  
  invitee = User.where(email: email).first
  
  # User does not yet have an account
  message = if invitee.nil?
    
  "<p>Hello,</p>

  <p>#{@user.full_name} has invited you to join a group on Syme, the encrypted social network. All you need to do is sign up to accept the invitation and get started.</p>

  <p><a href='http://www.getsyme.com'>[Sign up]</a></p>

  <p>Best,</p>
  <p>Syme</p>
  "
  
  # User already has an account
  else
    
  "<p>Hey #{invitee.full_name},</p>

  <p>#{@user.full_name} has just invited you to join a group on Syme, the encrypted social network. Log on to your Syme account to accept the invitation.</p>
  
  <p>Best,</p>
  <p>Syme</p>
  "
    
  end

  # email
  send_email_to(email, subject, message)

end

def request_confirm(invite)

  invitee, inviter = invite.invitee, invite.inviter

  subject = "Grant #{invitee.full_name} access to #{invite.group.name} on Syme"

  message =

  "<p>Hello #{inviter.full_name},</p>

  <p>#{invitee.full_name} has accepted the invitation to your group on Syme.</p>
  <p>You need to log on to your account to confirm and grant him or her access.</p>

  <p>Best,</p>
  <p>Syme</p>"

  # inviter.email
  send_email_to(inviter.email, subject, message)

end


def notify_confirmed(invite)

  invitee, inviter = invite.invitee, invite.inviter

  subject = "You've been granted access to #{invite.group.name} on Syme"

  message =

"<p>Hello #{invitee.full_name},</p>

<p>#{inviter.full_name} has granted you access to #{invite.group.name} on Syme.</p>
All you need to do is log on to your account to start sharing.</p>

<p>Best,</p>
<p>Syme</p>"

  # invitee.email
  send_email_to(invitee.email, subject, message)

end