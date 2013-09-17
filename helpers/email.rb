def send_email_to(email, subject, body)

  puts body
  return

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

def send_beta_invite(email, token)

  subject = "You've been signed up for an invite"

  message = haml :'mails/send_beta_invite',
    layout: :'mails/layout'

  send_email_to(email, subject, message)

end

def send_beta_welcome(email, token)

  subject = "Welcome to Syme beta"

  message = haml :'mails/send_beta_welcome',
    layout: :'mails/layout'

  send_email_to(email, subject, message)

end

def send_email_confirm(email, token)

  subject = "Confirm your Syme account"

  # @LOUIS: @user DOESN'T SEEM TO BE DEFINED HERE
  return

  message = haml :'mails/send_email_confirm',
    layout: :'mails/layout',
    locals: { user: @user }

  send_email_to(email, subject, message)

end

def send_invite(email, token)

  subject = "You've been invited to a group on Syme"

  invitee = User.where(email: email).first

  message = haml invitee.nil? ?
    :'mails/send_invite_new_user' : :'mails/send_invite_old_user',
    layout: 'mails/layout'

  send_email_to(email, subject, message)

end

def request_confirm(invite)

  invitee, inviter = invite.invitee, invite.inviter

  subject = "Confirm your new group member on Syme"

  message = haml :'mails/request_confirm',
    layout: :'mails/layout'

  # inviter.email
  send_email_to(inviter.email, subject, message)

end


def notify_confirmed(invite)

  invitee, inviter = invite.invitee, invite.inviter

  subject = "You've joined a new group on Syme"

  message = haml :'mails/notify_confirmed',
    layout: :'mails/layout'

  # invitee.email
  send_email_to(invitee.email, subject, message)

end