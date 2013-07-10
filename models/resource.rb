class Resource

  include Mongoid::Document
  include Mongoid::Timestamps

  field :owner_id, type: String
  
  attr_readonly :owner_id
  attr_accessible :owner_id
  
  require_relative 'resource/authorizable'
  require_relative 'resource/likeable'
  require_relative 'resource/deletable'
  require_relative 'resource/keyable'

  # Get the name of the resource.
  def model_name
    self.class.to_s.split('::')[-1].downcase
  end

  # Provide access to the parent group in
  # nested documents (e.g. likes, comments).
  def parent_group
    ancestor = self
    loop do
      break if ancestor.respond_to?(:group)
      ancestor = ancestor._parent
    end
    ancestor.group
  end
  
  def owner
    parent_group.users.find(owner_id)
  rescue Mongoid::Errors::DocumentNotFound
    nil
  end

  def self.validates_is_bson_id(field)
    validates_format_of field, with: /[0-9a-f]{24}/
  end

  def self.validates_is_base64(field)
    validates_format_of field, with:
    /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/
  end

  def has_high_entropy
    if content.entropy < 4.5
      raise "Message has insufficient entropy."
    end
  end

end
