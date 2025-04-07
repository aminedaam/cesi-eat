package com.example.microservicecommande.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {

    private String restaurantId;
    private String name;
    private String address;
    private String city;
    private String postalCode;
    private String country;
    private String longitude;
    private String latitude;
}
