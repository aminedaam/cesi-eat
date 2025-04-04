package com.cesieats.microservicerestaurant.entity;

import com.cesieats.microservicerestaurant.enums.Categorie;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Check;

@Entity
@Table(name = "Restaurant")
@Getter
@Setter
@NoArgsConstructor
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String country;

    private double longitude;

    private double latitude;

    @Column(nullable = false)
    private String city;

    private String imagePath;

    private String description;

    @Column(nullable = false)
    private double delevryCost;

    private String email;

    private String created_date;

    private String oppeningHours;

    private String closingTime;

    private String phoneNumber;

    @Column(name = "average_rate", nullable = false)
    private double averageRate;

    @Enumerated(EnumType.STRING)
    @Column(name = "categorie", nullable = false)
    private Categorie categorie;

    private int nbRate;

}
