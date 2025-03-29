package com.cesieats.microservicerestaurant.repository;

import com.cesieats.microservicerestaurant.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
}
