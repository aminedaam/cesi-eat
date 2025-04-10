package com.cesieats.serviceuser.dto;

import com.cesieats.serviceuser.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserRoleUpdateDTO {

    @NotNull(message = "Le rôle est obligatoire")
    @Schema(description = "Nouveau rôle de l'utilisateur", example = "ROLE_ADMIN")
    private Role newRole;

    public UserRoleUpdateDTO(Role newRole) {
        this.newRole = newRole;
    }

}