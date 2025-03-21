package com.cesieats.serviceuser.controller;

import com.cesieats.serviceuser.dto.UserDTO;
import com.cesieats.serviceuser.dto.UserRoleUpdateDTO;
import com.cesieats.serviceuser.dto.UserUpdatePasswordDTO;
import com.cesieats.serviceuser.entity.User;
import com.cesieats.serviceuser.exception.UserNotFoundException;
import com.cesieats.serviceuser.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/create")
    public User create(@Valid @RequestBody User user){
        return userService.saveUser(user);
    }

    @GetMapping("/read")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @PutMapping("/update-profil/{id}")
    public UserDTO update(@PathVariable Long id, @Valid @RequestBody UserDTO userUpdated) throws UserNotFoundException { // http://localhost:8080/user/update/125
        return userService.updateUser(id,userUpdated);
    }


    @PutMapping("/update-password/{id}")// Dans la requete update le json doit être avec newPassword et pas password car on point sur l'attribut du UserUpdatePassworDTO
    // TODO on verra par la suite si on crypt le message ou non
    public String updatePassword(@PathVariable Long id, @Valid @RequestBody UserUpdatePasswordDTO userUpdatedPassword) throws UserNotFoundException { // http://localhost:8080/user/update/125
        userService.updatePassword(id,userUpdatedPassword);
        return "Mot de passe mis à jour";
    }

    @PutMapping("/update-role/{id}")
    @PreAuthorize("hasAuthority('ADMIN')") // Vérifie que l’utilisateur est bien ADMIN
    public String updateUserRole(@PathVariable Long id, @Valid @RequestBody UserRoleUpdateDTO roleUpdateDTO) throws UserNotFoundException {
        userService.updateUserRole(id, roleUpdateDTO);
        return "Rôle mis à jour avec succès";
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Long id) throws UserNotFoundException {
        userService.deleteUser(id);
        return "Utilisateur supprimé";
    }

}
