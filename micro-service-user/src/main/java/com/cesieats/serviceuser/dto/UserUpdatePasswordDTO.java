package com.cesieats.serviceuser.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdatePasswordDTO {
    @NotBlank
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    @Schema(description = "Ancien mot de passe de l'utilisateur", example = "AncienMotDePasse123")
    private String newPassword;
}
