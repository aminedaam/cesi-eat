package com.cesieats.microservicerestaurant.service;

import com.cesieats.microservicerestaurant.entity.Article;
import com.cesieats.microservicerestaurant.enums.Produit;
import com.cesieats.microservicerestaurant.error.ArticleNotFoundException;
import com.cesieats.microservicerestaurant.error.ProduitNotFoundException;
import com.cesieats.microservicerestaurant.error.RestaurantNotFoundException;

import java.util.List;



public interface ArticleService {

    List<Article> getAllArticle();

    List<Article> findArticleByProduit(Produit typeProduit) throws ProduitNotFoundException,
            ArticleNotFoundException;

    List<Article> findArticleByName(String name) throws ArticleNotFoundException;

    List<Article> findArticleByRestaurantId(Long restaurantId) throws ArticleNotFoundException, RestaurantNotFoundException;
    Article findArticleById(Long id) throws ArticleNotFoundException;

    Article saveArticle(Article article);

     void deleteArticle(Long id) throws ArticleNotFoundException;

    Article updateArticle(Long id, Article article) throws ArticleNotFoundException;

    List<Article> findArticleByProduitAndRestaurantId(Produit typeProduit, Long restaurantId) throws RestaurantNotFoundException,ArticleNotFoundException;

    List<Article> findArticlesByMenuId(Long menuId) throws ArticleNotFoundException;


}
