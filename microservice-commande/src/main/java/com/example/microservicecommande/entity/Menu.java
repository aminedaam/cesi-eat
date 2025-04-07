package com.example.microservicecommande.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Menu {
    private String menuId;
    private String name;
    private String description;
    private double price;
    private String imageUrl;
    private String restaurantId;
    private String categoryId;
    private int quantity;
}
