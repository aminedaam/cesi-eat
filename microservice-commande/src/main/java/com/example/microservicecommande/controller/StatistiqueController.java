package com.example.microservicecommande.controller;


import com.example.microservicecommande.entity.Article;
import com.example.microservicecommande.entity.Menu;
import com.example.microservicecommande.services.CommandeService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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
    @GetMapping("/worstMenu/{restaurantId}")
    public Menu getWorstMenuByRestaurantId(@PathVariable long restaurantId) {
        return commandeService.worstMenuByRestaurantId(restaurantId);
    }
    @GetMapping("/worstArticle/{restaurantId}")
    public Article getWorstArticleByRestaurantId(@PathVariable long restaurantId) {
        return commandeService.worstArticleByRestaurantId(restaurantId);
    }

    @GetMapping("/getCountArticles/restaurant/{restaurantId}/article/{articleId}")
    public int getCountArticlesByRestaurantId(@PathVariable long restaurantId, @Valid @PathVariable String articleId) {
        return commandeService.getCountArticleByRestaurantIdAndArticleId(restaurantId, articleId);
    }
    @GetMapping("/getCountMenus/restaurant/{restaurantId}/menu/{menuId}")
    public int getCountMenusByRestaurantId(@PathVariable long restaurantId, @Valid @PathVariable String menuId) {
        return commandeService.getCountMenuByRestaurantIdAndMenuId(restaurantId, menuId);
    }





}
