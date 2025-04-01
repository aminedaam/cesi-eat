package com.cesieats.serviceuser.service;

import com.cesieats.serviceuser.dto.UserDTO;
import com.cesieats.serviceuser.dto.UserRoleUpdateDTO;
import com.cesieats.serviceuser.dto.UserUpdatePasswordDTO;
import com.cesieats.serviceuser.entity.User;
import com.cesieats.serviceuser.exception.UserNotFoundException;

import java.util.List;
import java.util.Optional;

public interface UserService {


    List<User> getAllUsers();

    Optional<User> getUserById(Long id);
    User saveUser(User user);
    void deleteUser(Long id) throws UserNotFoundException;

    UserDTO updateUser(Long id, UserDTO userUpdated) throws UserNotFoundException;
    void updatePassword(Long id, UserUpdatePasswordDTO passwordDTO) throws UserNotFoundException;
    void updateUserRole(Long id, UserRoleUpdateDTO userRoleUpdateDTO) throws UserNotFoundException;
    Optional<User> getUserByEmail(String email);
}
