package com.cesieats.microservicerestaurant.controller;

import com.cesieats.microservicerestaurant.entity.Restaurant;
import com.cesieats.microservicerestaurant.enums.Categorie;
import com.cesieats.microservicerestaurant.error.RestaurantNotFoundException;
import com.cesieats.microservicerestaurant.service.RestaurantService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/restaurants")
public class RestaurantController {

    @Autowired
    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }


    @PostMapping("/create")
    @PreAuthorize("hasAuthority('RESTAURATEUR')")
    public ResponseEntity<Restaurant> createRestaurant(@Valid @RequestBody Restaurant restaurant) {
        Restaurant created = restaurantService.saveRestaurant(restaurant);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("update/{id}")
    @PreAuthorize("hasAuthority('RESTAURATEUR')")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable Long id, @Valid @RequestBody Restaurant restaurant) throws RestaurantNotFoundException {
        Restaurant updated = restaurantService.updateRestaurant(id, restaurant);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('RESTAURATEUR')")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) throws RestaurantNotFoundException {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurant(@PathVariable Long id) throws RestaurantNotFoundException {
        Restaurant restaurant = restaurantService.findRestaurantById(id);
        return ResponseEntity.ok(restaurant);
    }
    @GetMapping("/all")
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantService.getAllRestaurant();
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/categorie/{categorie}")
    public ResponseEntity<List<Restaurant>> getRestaurantsByCategorie(@PathVariable Categorie categorie) {
        List<Restaurant> restaurants = restaurantService.findByCategorie(categorie);
        return ResponseEntity.ok(restaurants);
    }
}
