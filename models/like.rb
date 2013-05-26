require_relative 'resource'

class Like < Resource

  embedded_in :likeable, polymorphic: true

end