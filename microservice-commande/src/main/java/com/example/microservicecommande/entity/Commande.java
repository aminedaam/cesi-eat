package com.example.microservicecommande.entity;

import jakarta.persistence.Id;
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
    @Id
    private String id;

    private Restaurant restaurant;

    private User client;

    private List<Article> article;

    private List<Menu> menu;

    private double prixTotal;

    private double sousTotal;

    private String createdAt;

    private String status;

    private double deliveryCosts;

    private double servicesFees;

    private boolean promotion;

    private Livreur livreur;


}
