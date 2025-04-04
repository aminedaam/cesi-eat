package com.cesieats.microservicerestaurant.repository;

import com.cesieats.microservicerestaurant.entity.Restaurant;
import com.cesieats.microservicerestaurant.enums.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    List<Restaurant> findByCategorie(Categorie categorie);
}
