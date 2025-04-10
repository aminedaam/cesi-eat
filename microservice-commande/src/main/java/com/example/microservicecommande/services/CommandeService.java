package com.example.microservicecommande.services;

import com.example.microservicecommande.dto.CommandeCreatedEvent;
import com.example.microservicecommande.entity.Article;
import com.example.microservicecommande.entity.Menu;
import com.example.microservicecommande.exception.CommandeNotFoundException;
import com.example.microservicecommande.repository.CommandeRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.example.microservicecommande.entity.Commande;
import com.example.microservicecommande.config.RabbitMqConfig;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CommandeService {


    private final CommandeRepository commandeRepository;

    private final RabbitTemplate rabbitTemplate;

    @Value("${spring.application.name:DefaultServiceName}")
    private String serviceName;

    public CommandeService(CommandeRepository commandeRepository, RabbitTemplate rabbitTemplate) {
        this.commandeRepository = commandeRepository;
        this.rabbitTemplate = rabbitTemplate;
    }
    public void createCommande(Commande commande) {
        // on créer la commande dans la base de données
        Commande savedCommande = commandeRepository.save(commande);

        CommandeCreatedEvent commandeCreatedEvent = new CommandeCreatedEvent(
                savedCommande.getId(),
                savedCommande.getClient().getId(),
                savedCommande.getRestaurant().getId(),
                savedCommande.isPromotion(),
                savedCommande.getStatus()
        );

        // puis on publie l'événement "created" dans RabbitMQ
        rabbitTemplate.convertAndSend(
                RabbitMqConfig.EXCHANGE_COMMANDE_EVENTS,      // Nom de l'exchange
                RabbitMqConfig.ROUTING_KEY_CREATED,           // Routing key
                commandeCreatedEvent                          // Le message (peut être un objet)
        );
    }

    public void updateCommande(String commandeId, Commande commandeUpdated) throws CommandeNotFoundException {
        Commande commande = commandeRepository.findById(commandeId).orElseThrow(
                () -> new CommandeNotFoundException("Commande non trouvée avec l'id :" + commandeUpdated.getId()));
        if (commande != null) {
            commande.setArticle(commandeUpdated.getArticle());
            commande.setMenu(commandeUpdated.getMenu());
            commande.setPrixTotal(commandeUpdated.getPrixTotal());
            // Dans la logique de l'application on est pas censé pouvoir modifier le restaurant et le client d'une commande
            //commande.setRestaurantId(commandeUpdated.getRestaurantId());
            //commande.setClientId(commandeUpdated.getClientId());
            commandeRepository.save(commande);
        }
    }
    public void updateCommandeStatus(String commandeId, String status) throws CommandeNotFoundException {
        Commande commande = commandeRepository.findById(commandeId).orElseThrow(
                () -> new CommandeNotFoundException("Commande non trouvée avec l'id :" + commandeId));
        if (commande != null) {
            commande.setStatus(status);
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

    public List<Commande> getAllCommandesByRestaurantId(Long restaurantId) {
        return commandeRepository.findAll().stream()
                .filter(commande -> commande.getRestaurant().getId() == restaurantId)
                .toList();
    }

    public List<Commande> getAllCommandesByClientId(Long clientId) {
        return commandeRepository.findAll().stream()
                .filter(commande -> commande.getClient().getId() == clientId)
                .toList();
    }

    public void deleteCommande(String commandeId) throws CommandeNotFoundException {
        Commande commande = commandeRepository.findById(commandeId).orElseThrow(
                () -> new CommandeNotFoundException("Commande non trouvée avec l'id :" + commandeId));
        if (commande != null) {
            commandeRepository.delete(commande);
        }
    }

    public List<Commande> getCommandeByStatus(String status) {
        List<Commande> commandes = commandeRepository.findAll().stream()
                .filter(commande -> commande.getStatus().toString().equals(status))
                .toList();
        return commandes;
    }

    public int countCommandeByRestaurandId(Long restaurantId) {
        return (int) commandeRepository.findAll().stream()
                .filter(commande -> commande.getRestaurant().getId() == restaurantId)
                .filter(commande -> commande.getStatus().equals("DELIVERED"))
                .count();
    }

    public double getTotalPriceByRestaurantId(Long restaurantId) {
        return commandeRepository.findAll().stream()
                .filter(commande -> commande.getRestaurant().getId() == restaurantId)
                .filter(commande -> commande.getStatus().equals("DELIVERED"))
                .mapToDouble(Commande::getPrixTotal)
                .sum() * 0.1;
    }
    public Article bestArticleByRestaurantId(Long restaurantId) {
        Map<Article, Integer> articleQuantities = new HashMap<>();

        for (Commande commande : commandeRepository.findAll()) {
            if (commande.getRestaurant().getId() == restaurantId &&
                    commande.getStatus().equals("DELIVERED")) {

                for (Article article : commande.getArticle()) {
                    articleQuantities.merge(article, article.getQuantity(), Integer::sum);
                }
            }
        }
        return articleQuantities.entrySet().stream()
                .max(Comparator
                        .comparingInt(Map.Entry<Article, Integer>::getValue)
                        .thenComparing(e -> e.getKey().getPrice()))
                .map(Map.Entry::getKey)
                .orElseThrow(() -> new IllegalArgumentException("Aucun article trouvé"));
    }

    public Menu bestMenuByRestaurantId(Long restaurantId) {
        Map<Menu, Integer> menuQuantites = new HashMap<>();

        for (Commande commande : commandeRepository.findAll()) {
            if (commande.getRestaurant().getId() == restaurantId &&
                    commande.getStatus().equals("DELIVERED")) {

                for (Menu menu : commande.getMenu()) {
                    menuQuantites.merge(menu, menu.getQuantity(), Integer::sum);
                }
            }
        }
        return menuQuantites.entrySet().stream()
                .max(Comparator
                        .comparingInt(Map.Entry<Menu, Integer>::getValue)
                        .thenComparing(e -> e.getKey().getPrice()))
                .map(Map.Entry::getKey)
                .orElseThrow(() -> new IllegalArgumentException("Aucun article trouvé"));
    }

    public Menu worstMenuByRestaurantId(Long restaurantId) {
        Map<Menu, Integer> menuQuantites = new HashMap<>();

        for (Commande commande : commandeRepository.findAll()) {
            if (commande.getRestaurant().getId() == restaurantId &&
                    commande.getStatus().equals("DELIVERED")) {

                for (Menu menu : commande.getMenu()) {
                    menuQuantites.merge(menu, menu.getQuantity(), Integer::sum);
                }
            }
        }
        return menuQuantites.entrySet().stream()
                .min(Comparator
                        .comparingInt(Map.Entry<Menu, Integer>::getValue)
                        .thenComparing(e -> e.getKey().getPrice()))
                .map(Map.Entry::getKey)
                .orElseThrow(() -> new IllegalArgumentException("Aucun article trouvé"));
    }

    public Article worstArticleByRestaurantId(Long restaurantId) {
        Map<Article, Integer> articleQuantities = new HashMap<>();
        for (Commande commande : commandeRepository.findAll()) {
            if (commande.getRestaurant().getId() == restaurantId &&
                    commande.getStatus().equals("DELIVERED")) {

                for (Article article : commande.getArticle()) {
                    articleQuantities.merge(article, article.getQuantity(), Integer::sum);
                }
            }
        }
        return articleQuantities.entrySet().stream()
                .min(Comparator
                        .comparingInt(Map.Entry<Article, Integer>::getValue)
                        .thenComparing(e -> e.getKey().getPrice()))
                .map(Map.Entry::getKey)
                .orElseThrow(() -> new IllegalArgumentException("Aucun article trouvé"));
    }

}
