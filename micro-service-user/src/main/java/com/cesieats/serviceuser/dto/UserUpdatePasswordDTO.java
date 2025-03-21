package com.cesieats.serviceuser.dto;

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
    private String newPassword;
}
