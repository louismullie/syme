module Asocial

  class Publisher

    class << self
      attr_accessor :publisher
    end

    EM.next_tick do
      self.publisher = AMQP.connect(host: '127.0.0.1')
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

      self.publish(user_id, data)

    end

    private

    def self.publish(user_id, data)
      channel = Subscriber.channels[user_id]
      exchange = channel.default_exchange
      exchange.publish(data.to_json, routing_key: user_id)
    end
    
  end

  class Subscriber

    class << self
      attr_accessor :connection
      attr_accessor :channels
      attr_accessor :clients
    end

    EM.next_tick do

      self.connection = AMQP.connect(host: '127.0.0.1')
      self.channels, self.clients = {}, {}

    end

    def self.connected_users(group)

      connected_users = []

      group.users.each do |user|
        if self.clients[user.id.to_s]
          connected_users << user.id.to_s
        end
      end

      connected_users

    end

    def self.subscribe(user_id, out)
      
      unless channels[user_id]
        
        channels[user_id] = AMQP::Channel.new(connection)
        channel = channels[user_id]
      
        queue = channel.queue(user_id, auto_delete: true)

        queue.subscribe do |payload|
          self.clients[user_id].each do |client|
            client << "data: #{payload}\n\n"
          end
        end

      end
      
      self.clients[user_id] ||= []
      self.clients[user_id] << out
      self.clients[user_id].length

    end

    def self.unsubscribe(user_id, client_id)

      if self.clients[user_id][client_id]
        self.clients[user_id].delete_at(client_id)
      end

      if self.clients[user_id].length == 0
        self.clients.unsubscribe(user_id)
      end

    end

  end

end
