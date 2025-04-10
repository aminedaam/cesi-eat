package com.cesieats.serviceuser.service;

import com.cesieats.serviceuser.entity.Parrainage;
//import com.cesieats.serviceuser.exception.UserNotFoundException;
//import com.example.microservicecommande.entity.Commande;
import com.example.microservicecommande.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CommandeEventConsumer {

    private final ParrainageService parrainageService;
//    @RabbitListener(queues = "commande.created.queue")
//    public void handleCommandeCreated(Commande commande) throws UserNotFoundException {
//
//        User parrainer = commande.getClient();
//        Parrainage parrainage =  parrainageService.findByParrainneId(parrainer.getId());
//
//        if (commande.isPromotion()) {
//            parrainageService.updatePromotion(parrainage.getId(), false);
//            System.out.println("Promotion détectée pour l'user id: " + commande.getClient().getId());
//        }
//    }

}
