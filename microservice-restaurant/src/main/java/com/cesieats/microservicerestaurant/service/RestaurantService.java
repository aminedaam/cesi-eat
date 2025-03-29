package com.cesieats.microservicerestaurant.service;

import com.cesieats.microservicerestaurant.dto.RestaurantDTO;
import com.cesieats.microservicerestaurant.entity.Categorie;
import com.cesieats.microservicerestaurant.entity.Restaurant;
import com.cesieats.microservicerestaurant.error.RestaurantNotFoundException;

import java.util.List;

public interface RestaurantService {

    List<RestaurantDTO> getAllRestaurant();

    List<RestaurantDTO> getRestaurantByCategorie(Categorie categorie);


    Restaurant saveRestaurant(Restaurant restaurant);

    void deleteRestaurant(Long id) throws RestaurantNotFoundException;

    RestaurantDTO updateRestaurant(Long id, RestaurantDTO restaurantDto) throws RestaurantNotFoundException;

}
