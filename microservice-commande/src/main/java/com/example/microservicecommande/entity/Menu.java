package com.example.microservicecommande.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Menu {
    private String id;
    private String name;
    private String description;
    private double price;
    private String restaurantId;
    private int quantity;
}
