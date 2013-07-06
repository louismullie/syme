def track(user, event, properties = {})
  Analytics.track(
    user_id: user.id.to_s,
    event: event,
    properties: properties
  )
end