package com.cesieats.serviceuser.service;

import com.cesieats.serviceuser.dto.UserDTO;
import com.cesieats.serviceuser.dto.UserRoleUpdateDTO;
import com.cesieats.serviceuser.dto.UserUpdatePasswordDTO;
import com.cesieats.serviceuser.entity.User;
import com.cesieats.serviceuser.exception.CodeParrainageAlreadyUsedException;
import com.cesieats.serviceuser.exception.InvalidPasswordException;
import com.cesieats.serviceuser.exception.UserEmailUsedException;
import com.cesieats.serviceuser.exception.UserNotFoundException;

import java.util.List;
import java.util.Optional;

public interface UserService {


    List<User> getAllUsers();

    Optional<User> getUserByEmail(String email) throws UserNotFoundException;

    Optional<User> getUserById(Long id) throws UserNotFoundException;
    User saveUser(User user) throws UserEmailUsedException, CodeParrainageAlreadyUsedException;

    User updateUser(Long id, UserDTO userUpdated) throws UserNotFoundException, UserEmailUsedException;
    void updatePassword(Long id, UserUpdatePasswordDTO passwordDTO) throws UserNotFoundException, InvalidPasswordException;
    void updateUserRole(Long id, UserRoleUpdateDTO userRoleUpdateDTO) throws UserNotFoundException;

    void deleteUserByEmail(String email) throws UserNotFoundException;

    void updateStatus(Long id, String status) throws UserNotFoundException;

    List<User> getUserByRole(String role) throws UserNotFoundException;
}
