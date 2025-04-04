package com.cesieats.microservicerestaurant.service;

import com.cesieats.microservicerestaurant.enums.Categorie;
import com.cesieats.microservicerestaurant.entity.Restaurant;
import com.cesieats.microservicerestaurant.error.RestaurantNotFoundException;

import java.util.List;

public interface RestaurantService {

    List<Restaurant> getAllRestaurant();

    List<Restaurant> findByCategorie(Categorie categorie);


    Restaurant findRestaurantById(Long id) throws RestaurantNotFoundException;

    Restaurant saveRestaurant(Restaurant restaurant);

    void deleteRestaurant(Long id) throws RestaurantNotFoundException;

    Restaurant updateRestaurant(Long id, Restaurant restaurantDto) throws RestaurantNotFoundException;

}
