class UserObserver < Mongoid::Observer

  def after_create(user)
    identify_user(user)
  end

  def identify_user(user)
    
    #EventAnalysis.identify(user)
    EventAnalysis.track(user, 'User started registration')

  end

end