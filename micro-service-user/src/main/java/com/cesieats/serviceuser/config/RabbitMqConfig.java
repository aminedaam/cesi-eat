package com.cesieats.serviceuser.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    public static final String EXCHANGE_COMMANDE_EVENTS = "commande.events";
    public static final String ROUTING_KEY_CREATED = "commande.created";
    public static final String ROUTING_KEY_CONFIRMED = "commande.confirmed";
    public static final String ROUTING_KEY_DELIVERED = "commande.delivered";

    @Bean
    public DirectExchange commandeExchange() {
        return new DirectExchange(EXCHANGE_COMMANDE_EVENTS);
    }

    @Bean
    public Queue commandeCreatedQueue() {
        return new Queue("commande.created.queue", true);
    }

    @Bean
    public Queue commandeConfirmedQueue() {
        return new Queue("commande.confirmed.queue", true);
    }

    @Bean
    public Queue commandeDeliveredQueue() {
        return new Queue("commande.delivered.queue", true);
    }

    @Bean
    public Binding bindingCommandeCreated(Queue commandeCreatedQueue, DirectExchange commandeExchange) {
        return BindingBuilder.bind(commandeCreatedQueue).to(commandeExchange).with(ROUTING_KEY_CREATED);
    }

    @Bean
    public Binding bindingCommandeConfirmed(Queue commandeConfirmedQueue, DirectExchange commandeExchange) {
        return BindingBuilder.bind(commandeConfirmedQueue).to(commandeExchange).with(ROUTING_KEY_CONFIRMED);
    }

    @Bean
    public Binding bindingCommandeDelivered(Queue commandeDeliveredQueue, DirectExchange commandeExchange) {
        return BindingBuilder.bind(commandeDeliveredQueue).to(commandeExchange).with(ROUTING_KEY_DELIVERED);
    }
}
