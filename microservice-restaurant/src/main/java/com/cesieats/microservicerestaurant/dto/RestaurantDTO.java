package com.cesieats.microservicerestaurant.dto;

import com.cesieats.microservicerestaurant.entity.Restaurant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantDTO {

    private String name;

    private String adress;

    private String country;

    private String city;

    private String description;

    private String email;

    private String imagePath;

    public  RestaurantDTO(Restaurant restaurant) {
    }
}
