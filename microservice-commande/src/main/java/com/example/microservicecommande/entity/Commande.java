package com.example.microservicecommande.entity;

import com.example.microservicecommande.enums.Status;
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

    private String id;

    private Restaurant restaurant;

    private User client;

    private List<Article> article;

    private List<Menu> menu;


    private double prixTotal;

    private String createdAt;

    private Status status;
}
