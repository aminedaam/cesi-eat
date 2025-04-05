package com.cesieats.serviceuser.dto;

import com.cesieats.serviceuser.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserUpdateResponseDTO {

    String token;
    User user;

    public UserUpdateResponseDTO(String newToken, UserDTO updatedUserDTO) {
    }
}
