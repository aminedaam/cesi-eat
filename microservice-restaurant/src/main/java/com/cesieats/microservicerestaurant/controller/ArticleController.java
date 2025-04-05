package com.cesieats.microservicerestaurant.controller;

import com.cesieats.microservicerestaurant.config.JwtUtil;
import com.cesieats.microservicerestaurant.entity.Article;
import com.cesieats.microservicerestaurant.entity.Restaurant;
import com.cesieats.microservicerestaurant.enums.Produit;
import com.cesieats.microservicerestaurant.error.ArticleNotFoundException;
import com.cesieats.microservicerestaurant.error.ProduitNotFoundException;
import com.cesieats.microservicerestaurant.error.RestaurantNotFoundException;
import com.cesieats.microservicerestaurant.service.ArticleService;
import com.cesieats.microservicerestaurant.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/articles")
@AllArgsConstructor
public class ArticleController {


    private final ArticleService articleService;


    private final JwtUtil jwtUtil;


    @PostMapping("/create")
    @PreAuthorize("hasAuthority('RESTAURATEUR')")
    public ResponseEntity<Article> createArticle(@RequestHeader("Authorization") String token ,@Valid @RequestBody Article article) throws RestaurantNotFoundException {
        String email = jwtUtil.extractEmail(token.substring(7));

        if(!article.getRestaurant().getCreatorEmail().equals(email)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Article created = articleService.saveArticle(article);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('RESTAURATEUR')")
    public ResponseEntity<Article> updateArticle(@RequestHeader("Authorization") String token, @PathVariable Long id, @Valid @RequestBody Article article) throws ArticleNotFoundException {
        Article updated = articleService.updateArticle(id, article);
        String email = jwtUtil.extractEmail(token.substring(7));
        if(!article.getRestaurant().getCreatorEmail().equals(email)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('RESTAURATEUR')")
    public ResponseEntity<Void> deleteArticle(@RequestHeader("Authorization") String token, @PathVariable Long id) throws ArticleNotFoundException {
        Article deleted = articleService.findArticleById(id);
        String email = jwtUtil.extractEmail(token.substring(7));
        if(!deleted.getRestaurant().getCreatorEmail().equals(email)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticle(@PathVariable Long id) throws ArticleNotFoundException {
        Article article = articleService.findArticleById(id);
        return ResponseEntity.ok(article);
    }

    @GetMapping("/produit/{typeProduit}")
    public ResponseEntity<List<Article>> getArticleByProduit(@PathVariable Produit typeProduit) throws ArticleNotFoundException, ProduitNotFoundException {
        List<Article> articles = articleService.findArticleByProduit(typeProduit);
        return ResponseEntity.ok(articles);
    }


    @GetMapping("/produit/{typeProduit}/restaurant/{restaurantId}")
    public ResponseEntity<List<Article>> getArticleByProduitAndRestaurantId(@PathVariable Produit typeProduit, @PathVariable Long restaurantId) throws RestaurantNotFoundException,ArticleNotFoundException, ProduitNotFoundException {
        List<Article> articles = articleService.findArticleByProduitAndRestaurantId(typeProduit, restaurantId);
        return ResponseEntity.ok(articles);
    }
    @GetMapping("/all")
    public ResponseEntity<List<Article>> getAllArticles() {
        List<Article> articles = articleService.getAllArticle();
        return ResponseEntity.ok(articles);
    }
    @GetMapping("/restaurantName/{name}")
    public ResponseEntity<List<Article>> getArticlesByRestaurantName(@PathVariable String name) throws ArticleNotFoundException {
        List<Article> articles = articleService.findArticleByName(name);
        return ResponseEntity.ok(articles);
    }
    @GetMapping("/restaurantId/{restaurantId}")
    public ResponseEntity<List<Article>> getArticlesByRestaurantId(@PathVariable Long restaurantId) throws ArticleNotFoundException, RestaurantNotFoundException {
        List<Article> articles = articleService.findArticleByRestaurantId(restaurantId);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/menu/{menuId}")
    public ResponseEntity<List<Article>> getArticlesByMenuId(@PathVariable Long menuId) throws ArticleNotFoundException {
        List<Article> articles = articleService.findArticlesByMenuId(menuId);
        return ResponseEntity.ok(articles);
    }


}
