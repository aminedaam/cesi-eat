package com.cesieats.microservicerestaurant.repository;

import com.cesieats.microservicerestaurant.entity.Article;
import com.cesieats.microservicerestaurant.enums.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    Article findByName(String name);

    List<Article> findByRestaurantId(Long restaurantId);

    List<Article> findByTypeProd(Produit produit);


}
