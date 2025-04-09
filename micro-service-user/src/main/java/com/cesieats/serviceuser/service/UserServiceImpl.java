package com.cesieats.serviceuser.service;

import com.cesieats.serviceuser.dto.UserDTO;
import com.cesieats.serviceuser.dto.UserRoleUpdateDTO;
import com.cesieats.serviceuser.dto.UserUpdatePasswordDTO;
import com.cesieats.serviceuser.entity.User;
import com.cesieats.serviceuser.enums.Status;
import com.cesieats.serviceuser.exception.CodeParrainageAlreadyUsedException;
import com.cesieats.serviceuser.exception.InvalidPasswordException;
import com.cesieats.serviceuser.exception.UserEmailUsedException;
import com.cesieats.serviceuser.exception.UserNotFoundException;
import com.cesieats.serviceuser.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository ;

    private final PasswordEncoder passwordEncoder;
    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public String generateCodeParrainage() {
        StringBuilder code = new StringBuilder();
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (int i = 0; i < 6; i++) {
            int index = (int) (Math.random() * characters.length());
            code.append(characters.charAt(index));
        }
        if(userRepository.findByCodeParrainage(code.toString()) != null) {
            return generateCodeParrainage();
        }
        return code.toString();
    }
    @Override
    public User saveUser(User user) throws CodeParrainageAlreadyUsedException,UserEmailUsedException {
        // Hash du mot de passe avant enregistrement
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCodeParrainage(generateCodeParrainage());
        user.setStatus(Status.ACTIVE);
        if(user.getCodeParrainage() == null || user.getCodeParrainage().isEmpty()
                || userRepository.findByCodeParrainage(user.getCodeParrainage()) != null) {
            throw new CodeParrainageAlreadyUsedException("Le code de parrainage est déjà utilisé");
        }
        if(user.getEmail() == null || user.getEmail().isEmpty() || userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new UserEmailUsedException("L'email est incorrecte ou déjà utilisé");
        }
        return userRepository.save(user);
    }


    @Override
    public User updateUser(Long id, UserDTO userUpdated) throws UserNotFoundException, UserEmailUsedException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));

        if (userUpdated.getFirstName() != null && !userUpdated.getFirstName().isEmpty()) user.setFirstName(userUpdated.getFirstName());
        if (userUpdated.getLastName() != null && !userUpdated.getLastName().isEmpty()) user.setLastName(userUpdated.getLastName());
        if(userUpdated.getEmail() != null && !userUpdated.getEmail().isEmpty()) {

            Optional<User> userWithSameEmail = userRepository.findByEmail(userUpdated.getEmail());
            // je vérif si le mail existe déjà et si l'id de l'utilisateur est différent de celui de l'utilisateur en cours
            // de modification
            if (userWithSameEmail.isPresent() && !userWithSameEmail.get().getId().equals(user.getId())) {
                throw new UserEmailUsedException("L'email est déjà utilisé par un autre compte");
            }
            user.setEmail(userUpdated.getEmail());
        }

        if(userUpdated.getAddress() != null && !userUpdated.getAddress().isEmpty()) user.setAddress(userUpdated.getAddress());
        if(userUpdated.getCity() != null && !userUpdated.getCity().isEmpty()) user.setCity(userUpdated.getCity());
        if (userUpdated.getCountry() != null && !userUpdated.getCountry().isEmpty()) user.setCountry(userUpdated.getCountry());
        if (userUpdated.getPostalCode() != null && !userUpdated.getPostalCode().isEmpty()) user.setPostalCode(userUpdated.getPostalCode());
        if (userUpdated.getPhoneNumber() != null && !userUpdated.getPhoneNumber().isEmpty()) user.setPhoneNumber(userUpdated.getPhoneNumber());

        return userRepository.save(user);
    }

    @Override
    public void updatePassword(Long id, UserUpdatePasswordDTO userPasswordDTO) throws UserNotFoundException, InvalidPasswordException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));
        if(userPasswordDTO.getNewPassword() == null || userPasswordDTO.getNewPassword().isEmpty()) {
            throw new InvalidPasswordException("Le Mot de passe doit contenir au moins 8 caractères");
        }

        if(passwordEncoder.matches(userPasswordDTO.getNewPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Le Mot de passe doit etre différent de l'ancien");
        }
        user.setPassword(passwordEncoder.encode(userPasswordDTO.getNewPassword()));
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
    public void deleteUserByEmail(String email) throws UserNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));
        userRepository.delete(user);
    }


    @Override
    public void updateStatus(Long id, String status) throws UserNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));
        user.setStatus(Status.valueOf(status));
        userRepository.save(user);
    }
}
