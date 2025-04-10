package com.example.microservicecommande.controller;


import com.example.microservicecommande.entity.Article;
import com.example.microservicecommande.entity.Menu;
import com.example.microservicecommande.services.CommandeService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistiques")
@AllArgsConstructor
public class StatistiqueController {

    @Autowired
    private final CommandeService commandeService;

    @GetMapping("/totalCommandes/{restaurantId}")
    public int getTotalCommandesByRestaurantId(@PathVariable long restaurantId) {
        return commandeService.countCommandeByRestaurandId(restaurantId);
    }

    @GetMapping("/recette/{restaurantId}")
    public double getRecetteByRestaurantId(@PathVariable long restaurantId) {
        return commandeService.getTotalPriceByRestaurantId(restaurantId);
    }
    @GetMapping("/bestArticle/{restaurantId}")
    public Article getBestArticleByRestaurantId(@PathVariable long restaurantId) {
        return commandeService.bestArticleByRestaurantId(restaurantId);
    }

    @GetMapping("/bestMenu/{restaurantId}")
    public Menu getBestMenuByRestaurantId(@PathVariable long restaurantId) {
        return commandeService.bestMenuByRestaurantId(restaurantId);
    }

}
