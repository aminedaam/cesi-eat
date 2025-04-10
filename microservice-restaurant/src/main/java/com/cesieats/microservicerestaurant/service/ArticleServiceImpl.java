package com.cesieats.microservicerestaurant.service;

import com.cesieats.microservicerestaurant.entity.Article;
import com.cesieats.microservicerestaurant.enums.Produit;
import com.cesieats.microservicerestaurant.error.ArticleNotFoundException;
import com.cesieats.microservicerestaurant.error.ProduitNotFoundException;
import com.cesieats.microservicerestaurant.error.RestaurantNotFoundException;
import com.cesieats.microservicerestaurant.repository.ArticleRepository;
import com.cesieats.microservicerestaurant.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;

    private final RestaurantRepository restaurantRepository;

    public ArticleServiceImpl(ArticleRepository articleRepository, RestaurantRepository restaurantRepository) {

        this.articleRepository = articleRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @Override
    public List<Article> getAllArticle() {
        return articleRepository.findAll();
    }



    @Override
    public List<Article> findArticleByName(String name) throws ArticleNotFoundException {
        return articleRepository.findByName(name);
    }

    @Override
    public List<Article> findArticleByRestaurantId(Long restaurantId) throws ArticleNotFoundException, RestaurantNotFoundException {
        return articleRepository.findByRestaurant_Id(restaurantId);
    }

    @Override
    public Article findArticleById(Long id) throws ArticleNotFoundException {
        return articleRepository.findById(id).orElse(null);
    }


    @Override
    public List<Article> findArticleByProduit(Produit typeProduit) throws ProduitNotFoundException, ArticleNotFoundException {
        List<Article> articles = articleRepository.findByTypeProd(typeProduit);
        if(typeProduit == null) {
            throw new ProduitNotFoundException("Produit non trouvé");
        }
        if(articles.isEmpty()) {
            throw new ArticleNotFoundException("Aucun article trouvé pour ce type de produit");
        }
        return articles;
    }
    public List<Article> getArticleFilterByPrice(Produit typeProduit, double minPrice, double maxPrice) throws ProduitNotFoundException, ArticleNotFoundException {
        List<Article> articles =  articleRepository.findByTypeProd(typeProduit);
        if(typeProduit == null) {
            throw new ProduitNotFoundException("Produit non trouvé");
        }
        if(articles.isEmpty()) {
            throw new ArticleNotFoundException("Aucun article trouvé pour ce type de produit");
        }
        return articles.stream()
                .filter(article -> article.getPrice() >= minPrice && article.getPrice() <= maxPrice)
                .toList();
    }

    @Override
    public Article saveArticle(Article article) {
        articleRepository.save(article);
        return article;
    }

    @Override
    public void deleteArticle(Long id) throws ArticleNotFoundException {
        if(!articleRepository.existsById(id)) {
            throw new ArticleNotFoundException("Article non trouvé");
        }
        articleRepository.deleteById(id);
    }

    @Override
    public Article updateArticle(Long id, Article article) throws ArticleNotFoundException {
        Article existingArticle = articleRepository.findById(id).orElseThrow(() -> new ArticleNotFoundException("Article non trouvé"));
        existingArticle.setName(article.getName());
        existingArticle.setDescription(article.getDescription());
        existingArticle.setImagePath(article.getImagePath());
        existingArticle.setPrice(article.getPrice());
        existingArticle.setTypeProd(article.getTypeProd());
        return articleRepository.save(existingArticle);
    }

    @Override
    public List<Article> findArticleByProduitAndRestaurantId(Produit typeProduit, Long restaurantId) throws RestaurantNotFoundException,ArticleNotFoundException {
        if(restaurantRepository.findById(restaurantId).isEmpty()) {
            throw new RestaurantNotFoundException("Restaurant non trouvé");
        }
        List<Article> articles = articleRepository.findByTypeProdAndRestaurant_Id(typeProduit, restaurantId);
        if(articles.isEmpty()) {
            throw new ArticleNotFoundException("Aucun article trouvé pour ce type de produit dans ce restaurant");
        }
        return articles;
    }

    @Override
    public List<Article> findArticlesByMenuId(Long menuId) throws ArticleNotFoundException {
       if(menuId == null) {
            throw new ArticleNotFoundException("Menu non trouvé");
        }
        List<Article> articles = articleRepository.findByMenu_Id(menuId);
        if(articles.isEmpty()) {
            throw new ArticleNotFoundException("Aucun article trouvé pour ce menu");
        }
        return articles;
    }

}
