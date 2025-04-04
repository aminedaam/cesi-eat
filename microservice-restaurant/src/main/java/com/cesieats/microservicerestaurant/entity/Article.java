package com.cesieats.microservicerestaurant.entity;


import com.cesieats.microservicerestaurant.enums.Produit;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Check;

@Entity
@Table(name = "Article")
@Getter
@Setter
@NoArgsConstructor
public class Article {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false)
        private String name;

        @Column(nullable = false)
        private Produit typeProd;

        private String description;

        private String imagePath;

        @ManyToOne
        @JoinColumn(name = "restaurant_id", nullable = false)
        private Restaurant restaurant;

        private double price;

        private String createdAt;

        @ManyToOne
        @JoinColumn(name = "menu_id", nullable = false)
        private Menu menu;


}
