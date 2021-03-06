# Email sending helper. All email helpers call it.
def send_email_to(email, subject, body)

  begin
    return if settings.environment != :production &&
              !settings.running_tux
  rescue; end;

  user = begin
    User.find_by(email: email)
  rescue; end

  begin

    raise if user && user.unsubscribed
    
    Pony.mail({
      to: email,
      from: "Syme <team@getsyme.com>",
      subject: subject,
      headers: { 'Content-Type' => "text/html" },
      body: body,
      via: :smtp,
      via_options: {
        address: 'smtp.mandrillapp.com',
        port: '587',
        user_name: 'louis.mullie@gmail.com',
        password: 'tjCX49k-tDIYzmqnW0ZjYw',
        authentication: :plain,
        domain: "localhost.localdomain"
      }
    })

  rescue Exception => e

    warn "**** FAILED TO SEND EMAIL ****"

  end

end

# Manual HAML rendering in order to put mail templates
# outside of /views directory.
def email_template(template, recipient, locals = {})

  template  = File.join(settings.root, 'mails', "#{template.to_s}.haml")
  layout    = File.join(settings.root, 'mails', "layout.haml")

  recipient = CGI.escape(Base64.strict_encode64(recipient))
  token     = Digest::SHA2.hexdigest( recipient + EMAIL_SALT )

  locals.merge!({ recipient: recipient, unsubscribe_token: token })

  Haml::Engine.new(File.read(layout)).render(Object.new, locals) do
    Haml::Engine.new(File.read(template)).render(Object.new, locals)
  end

end

# Batch beta invitations
# 'emails' should be a string of email addresses separated by comma
# ex: app.batch_beta('example@domain.com, example2@domain.com')
def batch_beta(emails)
  emails.delete(' ').split(',').each do |email|
    send_beta_welcome(email)
  end
end

# Batch survey
# 'emails' should be a string of email addresses separated by comma
# ex: app.batch_beta('example@domain.com, example2@domain.com')
def batch_survey(emails)
  emails.delete(' ').split(',').each do |email|
    send_survey_email(email)
  end
end

# =====================================================
# Mail helpers
#
# TODO: refactor titles into hash, define one function

def send_beta_invite(email)

  subject = "Welcome to Syme beta"

  message = email_template :send_beta_invite, email

  send_email_to(email, subject, message)

end

def send_beta_welcome(email)

  subject = "You're in! Welcome to Syme beta"

  message = email_template :send_beta_welcome, email

  send_email_to(email, subject, message)

end

def send_invite(invitation)
  
  invitee, email = invitation.invitee, invitation.email
  
  inviter_name = invitation.inviter.full_name

  subject = "Join #{inviter_name}'s group on Syme"

  template = invitee.nil? ? :send_invite_new_user : :send_invite_old_user

  message = email_template template, email, { inviter_name: inviter_name }

  send_email_to(email, subject, message)

end

def send_invite_reminder(invitation)
  
  begin
    
    invitee = begin
      invitation.invitee
    rescue; end
    
    email = invitation.email
    inviter_name = invitation.inviter.full_name

    subject = "#{inviter_name} is waiting for you on Syme"

    template = invitee.nil? ? :send_invite_new_user : :send_invite_old_user

    message = email_template template, email, { inviter_name: inviter_name }

    send_email_to(email, subject, message)
    
  rescue
    puts "Could not send e-mail"
  end

end

def request_confirm(invite)

  begin
    invitee, inviter = invite.invitee, invite.inviter
  
    subject = "Grant #{invitee.full_name} access to your group on Syme"

    message = email_template :request_confirm, inviter.email, { invitee_name: invitee.full_name }

    # inviter.email
    send_email_to(inviter.email, subject, message)
  rescue
    puts "Failed to send request_confirm"
  end

end


def notify_confirmed(invite)

  begin
    invitee, inviter = invite.invitee, invite.inviter

    subject = "Begin sharing with #{inviter.full_name} on Syme"

    message = email_template :notify_confirmed, invitee.email, { inviter_name: inviter.full_name }

    # invitee.email
    send_email_to(invitee.email, subject, message)
  rescue
    puts "Failed to send notify_confirmed"
  end
  
end

def send_confirm_email(user)

  subject = "Confirm your new account on Syme"

  message = email_template(:send_email_confirm, user.email, { user: user })

  send_email_to(user.email, subject, message)

end

def send_survey_email(user_email)

  subject = "Help us improve Syme!"

  message = email_template(:survey, user_email, { })

  send_email_to(user_email, subject, message)

end

def send_activity_email(user)
  
  subject = "New group activity on Syme"

  message = email_template(:send_activity_email, user.email, {})

  send_email_to(user.email, subject, message)

end