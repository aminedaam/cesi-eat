package com.cesieats.serviceuser.service;

import com.cesieats.serviceuser.dto.UserDTO;
import com.cesieats.serviceuser.dto.UserRoleUpdateDTO;
import com.cesieats.serviceuser.dto.UserUpdatePasswordDTO;
import com.cesieats.serviceuser.entity.User;
import com.cesieats.serviceuser.exception.UserNotFoundException;
import com.cesieats.serviceuser.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository ;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }


    @Override
    public UserDTO updateUser(Long id, UserDTO userUpdated) throws UserNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));

        if (userUpdated.getFirstName() != null) user.setFirstName(userUpdated.getFirstName());
        if (userUpdated.getLastName() != null) user.setLastName(userUpdated.getLastName());
        if (userUpdated.getEmail() != null) user.setEmail(userUpdated.getEmail());

        return new UserDTO(userRepository.save(user));
    }

    @Override
    public void updatePassword(Long id, UserUpdatePasswordDTO passwordDTO) throws UserNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));

        user.setPassword(passwordDTO.getNewPassword());
        userRepository.save(user);
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')") // On Vérifie que l’utilisateur a le rôle ADMIN
    public void updateUserRole(Long userId, UserRoleUpdateDTO roleUpdateDTO) throws UserNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));

        user.setRole(roleUpdateDTO.getNewRole());
        userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) throws UserNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé !"));
        userRepository.delete(user);
    }
}
