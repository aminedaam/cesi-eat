package com.example.microservicecommande.services;

import com.example.microservicecommande.exception.CommandeNotFoundException;
import com.example.microservicecommande.repository.CommandeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.microservicecommande.entity.Commande;

import java.util.List;

@Service
@AllArgsConstructor
public class CommandeService {


    private final CommandeRepository commandeRepository;

    public void createCommande(Commande commande) {
        commandeRepository.insert(commande);
    }

    public void updateCommande(String commandeId, Commande commandeUpdated) throws CommandeNotFoundException {
        Commande commande = commandeRepository.findById(commandeId).orElseThrow(
                () -> new CommandeNotFoundException("Commande non trouvée avec l'id :" + commandeUpdated.getCommandeId()));
        if (commande != null) {
            commande.setArticles(commandeUpdated.getArticles());
            commande.setMenus(commandeUpdated.getMenus());
            commande.setPrixTotal(commandeUpdated.getPrixTotal());
            // Dans la logique de l'application on est pas censé pouvoir modifier le restaurant et le client d'une commande
            //commande.setRestaurantId(commandeUpdated.getRestaurantId());
            //commande.setClientId(commandeUpdated.getClientId());
            commandeRepository.save(commande);
        }
    }
    public Commande getCommandeById(String commandeId) throws CommandeNotFoundException {
        return commandeRepository.findById(commandeId).orElseThrow(
                () -> new CommandeNotFoundException("Commande non trouvée avec l'id :" + commandeId));
    }

    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }

    public List<Commande> getAllCommandesByRestaurantId(String restaurantId) {
        return commandeRepository.findAll().stream()
                .filter(commande -> commande.getRestaurantId().getRestaurantId().equals(restaurantId))
                .toList();
    }

    public List<Commande> getAllCommandesByClientId(String clientId) {
        return commandeRepository.findAll().stream()
                .filter(commande -> commande.getClientId().getUserId().equals(clientId))
                .toList();
    }

    public void deleteCommande(String commandeId) throws CommandeNotFoundException {
        Commande commande = commandeRepository.findById(commandeId).orElseThrow(
                () -> new CommandeNotFoundException("Commande non trouvée avec l'id :" + commandeId));
        if (commande != null) {
            commandeRepository.delete(commande);
        }
    }
}
