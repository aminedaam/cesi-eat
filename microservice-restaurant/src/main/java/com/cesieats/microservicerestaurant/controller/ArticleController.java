package com.cesieats.microservicerestaurant.controller;

import com.cesieats.microservicerestaurant.entity.Article;
import com.cesieats.microservicerestaurant.error.ArticleNotFoundException;
import com.cesieats.microservicerestaurant.service.ArticleService;
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


    @PostMapping
    @PreAuthorize("hasAuthority('RESTAURATEUR')")
    public ResponseEntity<Article> createArticle(@Valid @RequestBody Article article) {
        Article created = articleService.saveArticle(article);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('RESTAURATEUR')")
    public ResponseEntity<Article> updateArticle(@PathVariable Long id, @Valid @RequestBody Article article) throws ArticleNotFoundException {
        Article updated = articleService.updateArticle(id, article);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('RESTAURATEUR')")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) throws ArticleNotFoundException {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticle(@PathVariable Long id) throws ArticleNotFoundException {
        Article article = articleService.findArticleById(id);
        return ResponseEntity.ok(article);
    }

    @GetMapping
    public ResponseEntity<List<Article>> getAllArticles() {
        List<Article> articles = articleService.getAllArticle();
        return ResponseEntity.ok(articles);
    }


}
