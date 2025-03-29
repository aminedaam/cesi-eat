package com.cesieats.microservicerestaurant.controller;

import com.cesieats.microservicerestaurant.service.RestaurantService;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/restaurant")
public class RestaurantController {

    private final RestaurantService restaurantService;


    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }
}
