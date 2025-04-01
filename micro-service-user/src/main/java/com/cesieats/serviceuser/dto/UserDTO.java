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

    public UserDTO(User user) {
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
    }

}

