post '/settings/profile/update', auth: [] do

  # Is there a new first name?
  if !params[:first_name].empty? && params[:first_name] != @user.first_name
    begin
      @user.update_attributes!(first_name: params[:first_name])
    rescue Mongoid::Errors::Validations => error
      error t(:'errors.validation'), '/settings', error
    end
  end

  # Is there a new last name?
  if !params[:last_name].empty? && params[:last_name] != @user.last_name
    begin
      @user.update_attributes!(last_name: params[:last_name])
    rescue Mongoid::Errors::Validations => error
      error t(:'errors.validation'), '/settings', error
    end
  end

  # Has the password been modified?
  if !params['password'].empty?
    begin
      @user.update_attributes!(
        new_password: params[:password],
        new_password_confirmation: params[:password_confirmation]
      )
      # Renew session ID
      session.clear
    rescue Mongoid::Errors::Validations => error
      error t(:'errors.validation'), '/settings', error
    end
  end

  # Go back to settings
  redirect "/settings", 303

end