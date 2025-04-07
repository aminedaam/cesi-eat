package com.example.microservicecommande.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document("commande")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Commande {

    private String commandeId;

    private Restaurant restaurantId;

    private User clientId;

    private List<Article> articles;

    private List<Menu> menus;


    private double prixTotal;

    private String createdAt;
}
