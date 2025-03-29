package com.cesieats.microservicerestaurant.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Check;

@Entity
@Table(name = "Restaurant")
@Check(constraints = "average_rate >= 0 AND average_rate <= 5")
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
    private String adress;

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
    private double average_rate;

    private Categorie categorie;

    private int nbRate;


}
