package com.cesieats.serviceuser.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Requête d'authentification contenant les informations de connexion de l'utilisateur.")
public class AuthRequest {

    private String username;
    @Schema(description = "Mot de passe de l'utilisateur", example = "MonMotdePasseSecurise123./")
    private String password;

    @Schema(description = "Adresse email de l'utilisateur", example = "tonmail@gmail.com")
    private String email;
}
