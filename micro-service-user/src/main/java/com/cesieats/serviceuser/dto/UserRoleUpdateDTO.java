package com.cesieats.serviceuser.dto;

import com.cesieats.serviceuser.enums.Role;
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
    private Role newRole;

    public UserRoleUpdateDTO(Role newRole) {
        this.newRole = newRole;
    }

}