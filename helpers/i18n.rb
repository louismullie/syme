# Shortcuts for in-template translating

def translate(word)
  I18n.translate(word)
end

alias :t :translate

def localize(word)
  I18n.localize(word)
end

alias :l :localize