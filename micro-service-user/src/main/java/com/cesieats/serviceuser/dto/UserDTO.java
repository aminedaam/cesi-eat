package com.cesieats.serviceuser.dto;


import com.cesieats.serviceuser.entity.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/** On utilise un DTO pour respecter les données confidentielles de l'utilisateur
 * cela va nous permettre d'éviter de récuperer l'entity directement
 * et permettre de récuperer seulement les données qui nous interresent */
public class UserDTO {

    private String firstName;

    private String lastName;

    private String email;

    private String adress;

    private String city;

    private String country;

    private String postalCode;

    private String phoneNumber;

    private double latitude;

    private double longitude;



    public UserDTO(User user) {
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.adress = user.getAddress();
        this.city = user.getCity();
        this.country = user.getCountry();
        this.postalCode = user.getPostalCode();
        this.phoneNumber = user.getPhoneNumber();
        this.latitude = user.getLatitude();
        this.longitude = user.getLongitude();

    }

}

