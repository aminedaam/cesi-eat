package com.cesieats.microservicerestaurant.service;

import com.cesieats.microservicerestaurant.entity.Menu;
import com.cesieats.microservicerestaurant.error.MenuNotFoundException;

import java.util.List;

public interface MenuService {

    List<Menu> getAllMenu();

    Menu getMenuByName(String name);

    List<Menu> getMenuByRestaurantId(Long restaurantId);

    Menu findMenuById(Long id) throws MenuNotFoundException;

    Menu createMenu(Menu menu);

    void deleteMenu(Long id) throws MenuNotFoundException;

    Menu updateMenu(Long id, Menu menu) throws MenuNotFoundException;
}
