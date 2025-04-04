package com.cesieats.microservicerestaurant.service;

import com.cesieats.microservicerestaurant.entity.Article;
import com.cesieats.microservicerestaurant.enums.Categorie;
import com.cesieats.microservicerestaurant.enums.Produit;
import com.cesieats.microservicerestaurant.error.ArticleNotFoundException;
import com.cesieats.microservicerestaurant.error.ProduitNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;


public interface ArticleService {

    List<Article> getAllArticle();

    List<Article> getArticleByProduit(Produit typeProduit) throws ProduitNotFoundException;

    Article findArticleById(Long id) throws ArticleNotFoundException;

    Article saveArticle(Article article);

     void deleteArticle(Long id) throws ArticleNotFoundException;

    Article updateArticle(Long id, Article article) throws ArticleNotFoundException;

}
