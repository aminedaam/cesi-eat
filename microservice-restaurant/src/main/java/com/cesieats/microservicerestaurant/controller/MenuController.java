package com.cesieats.microservicerestaurant.controller;


import com.cesieats.microservicerestaurant.entity.Menu;
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
@RequestMapping("/menu")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }
    @PostMapping
    @PreAuthorize("hasAuthority('RESTAURATEUR')")
    public ResponseEntity<Menu> createMenu(@Valid @RequestBody Menu menu) {
        Menu created = menuService.createMenu(menu);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('RESTAURATEUR')")
    public ResponseEntity<Menu> updateMenu(@PathVariable Long id, @Valid @RequestBody Menu menu) throws MenuNotFoundException {
        Menu updated = menuService.updateMenu(id, menu);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("delete/{id}")
    @PreAuthorize("hasAuthority('RESTAURATEUR')")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) throws MenuNotFoundException {
        menuService.deleteMenu(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{name}")
    public ResponseEntity<Menu> getMenu(@PathVariable String name) {
        Menu menu = menuService.getMenuByName(name);
        return ResponseEntity.ok(menu);
    }

    @GetMapping
    public ResponseEntity<List<Menu>> getAllMenus() {
        List<Menu> menus = menuService.getAllMenu();
        return ResponseEntity.ok(menus);
    }

}
