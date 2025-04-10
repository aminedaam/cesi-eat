package com.cesieats.serviceuser.dto;

import com.cesieats.serviceuser.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserUpdateResponseDTO {

    @Schema(description = "Token d'authentification de l'utilisateur", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    String token;

    @Schema(description = "Informations de l'utilisateur mis à jour")
    User user;

    public UserUpdateResponseDTO(String newToken, UserDTO updatedUserDTO) {
    }
}
