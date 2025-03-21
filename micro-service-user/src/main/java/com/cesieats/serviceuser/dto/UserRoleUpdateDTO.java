package com.cesieats.serviceuser.dto;

import com.cesieats.serviceuser.entity.Role;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRoleUpdateDTO {

    @NotNull(message = "Le rôle est obligatoire")
    private Role newRole;

}