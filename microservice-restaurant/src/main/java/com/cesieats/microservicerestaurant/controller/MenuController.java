package com.cesieats.microservicerestaurant.controller;


import com.cesieats.microservicerestaurant.config.JwtUtil;
import com.cesieats.microservicerestaurant.entity.Menu;
import com.cesieats.microservicerestaurant.error.ArticleNotFoundException;
import com.cesieats.microservicerestaurant.error.MenuNotFoundException;
import com.cesieats.microservicerestaurant.service.MenuService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/menus")
@AllArgsConstructor
public class MenuController {

    private final MenuService menuService;
    private final JwtUtil jwtUtil;


    @PostMapping("/create")
    @PreAuthorize("hasAuthority('RESTAURATEUR')")
    public ResponseEntity<Menu> createMenu(@RequestHeader("Authorization") String token ,@Valid @RequestBody Menu menu) {
        String email = jwtUtil.extractEmail(token.substring(7));
        if(!menu.getRestaurant().getCreatorEmail().equals(email)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Menu created = menuService.createMenu(menu);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('RESTAURATEUR')")
    public ResponseEntity<Menu> updateMenu(@RequestHeader("Authorization") String token, @PathVariable Long id, @Valid @RequestBody Menu menu) throws MenuNotFoundException {
        String email = jwtUtil.extractEmail(token.substring(7));
        if(!menu.getRestaurant().getCreatorEmail().equals(email)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Menu updated = menuService.updateMenu(id, menu);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("delete/{id}")
    @PreAuthorize("hasAuthority('RESTAURATEUR')")
    public ResponseEntity<Void> deleteMenu(@RequestHeader("Authorization") String token, @PathVariable Long id) throws MenuNotFoundException, ArticleNotFoundException {
        String email = jwtUtil.extractEmail(token.substring(7));
        if(!menuService.findMenuById(id).getRestaurant().getCreatorEmail().equals(email)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        menuService.deleteMenu(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{name}")
    public ResponseEntity<Menu> getMenu(@PathVariable String name) throws MenuNotFoundException {
        Menu menu = menuService.getMenuByName(name);
        return ResponseEntity.ok(menu);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Menu>> getAllMenus() {
        List<Menu> menus = menuService.getAllMenu();
        return ResponseEntity.ok(menus);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Menu>> getMenusByRestaurantId(@PathVariable Long restaurantId) throws MenuNotFoundException {
        List<Menu> menus = menuService.getMenuByRestaurantId(restaurantId);
        return ResponseEntity.ok(menus);
    }

}
