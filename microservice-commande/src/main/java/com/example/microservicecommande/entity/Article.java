package com.example.microservicecommande.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class Article {

    private String Id;
    private String name;
    private String description;
    private double price;
    private String imagePath;
    private String typeProd;
    private String restaurantId;
    private int quantity;

}
