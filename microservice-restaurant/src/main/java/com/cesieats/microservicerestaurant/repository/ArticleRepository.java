package com.cesieats.microservicerestaurant.repository;

import com.cesieats.microservicerestaurant.entity.Article;
import com.cesieats.microservicerestaurant.enums.Produit;
import com.cesieats.microservicerestaurant.error.ArticleNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByName(String name);

    List<Article> findByRestaurant_Id(Long restaurantId);

    List<Article> findByTypeProd(Produit produit);

    List<Article> findByTypeProdAndRestaurant_Id(Produit produit, Long restaurantId);

    List<Article> findByMenu_Id(Long menuId) throws ArticleNotFoundException;

}
