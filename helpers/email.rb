# Email sending helper. All email helpers call it.
def send_email_to(email, subject, body)

  return if settings.environment != :production
  
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

end

# Manual HAML rendering in order to put mail templates
# outside of /views directory.
def email_template(template, recipient, locals = {})

  template  = File.join(settings.root, 'mails', "#{template.to_s}.haml")
  layout    = File.join(settings.root, 'mails', "layout.haml")

  recipient = CGI.escape(Base64.strict_encode64(recipient))
  token     = Digest::SHA2.hexdigest( recipient + settings.email_salt )

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

def send_email_confirm(email)

  subject = "Confirm your Syme account"

  message = email_template :send_email_confirm, email, { user: @user }
  
  send_email_to(email, subject, message)

end

def send_invite(email)

  subject = "You've been invited to a group on Syme"

  invitee = User.where(email: email).first

  template = invitee.nil? ? :send_invite_new_user : :send_invite_old_user

  message = email_template template, email
  
  warn message
  
  send_email_to(email, subject, message)

end

def request_confirm(invite)

  invitee, inviter = invite.invitee, invite.inviter

  subject = "Confirm your new group member on Syme"

  message = email_template :request_confirm, inviter.email

  # inviter.email
  send_email_to(inviter.email, subject, message)

end


def notify_confirmed(invite)

  invitee, inviter = invite.invitee, invite.inviter

  subject = "You've joined a new group on Syme"

  message = email_template :notify_confirmed, invitee.email

  # invitee.email
  send_email_to(invitee.email, subject, message)

end