package com.cesieats.microservicerestaurant.repository;

import com.cesieats.microservicerestaurant.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {

    List<Menu> findByRestaurant_Id(Long restaurantId);

    Menu findByName(String name);
}
