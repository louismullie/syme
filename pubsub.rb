module Asocial

  class Publisher

    class << self
      attr_accessor :publisher
    end

    EM.next_tick do
      self.publisher = EM::Hiredis.connect
    end

    def self.scatter(group, action, model, &block)

      Asocial::Subscriber.connected_users(group).each do |user_id|
        user = User.find(user_id)
        self.send_to(user_id, action, model, block.call(user))
      end

    end
 
    def self.broadcast(group, action, model, data = nil)

      Asocial::Subscriber.connected_users(group).each do |user_id|
        self.send_to(user_id, action, model, data)
      end

    end

    def self.send_to(user_id, action, model, data)

      warn 'Sending message to client'
      
      data = { action: action,
      model: model, data: data }

      self.publish(user_id, data.to_json)

    end

    private

    def self.publish(*args)
      self.publisher.publish(*args)
    end
    
  end


  class Subscriber

    class << self
      attr_accessor :subscriber
      attr_accessor :subscribers
    end

    EM.next_tick do

      self.subscriber = EM::Hiredis.connect
      self.subscribers = {}

      self.subscriber.on(:message) do |channel, message|
        self.subscribers[channel].each do |client|
          client << "data: #{message}\n\n"
        end
      end

    end

    def self.connected_users(group)

      connected_users = []

      group.users.each do |user|
        if self.subscribers[user.id.to_s]
          connected_users << user.id.to_s
        end
      end

      connected_users

    end

    def self.subscribe(user_id, out)

      subscriber.subscribe(user_id)
      subscribers[user_id] ||= []
      subscribers[user_id] << out
      warn out.inspect
      subscribers[user_id].length

    end

    def self.unsubscribe(user_id, client_id)

      if subscribers[user_id][client_id]
        subscribers[user_id].delete_at(client_id)
      end

      if subscribers[user_id].length == 0
        subscriber.unsubscribe(user_id)
      end

    end

  end

end
