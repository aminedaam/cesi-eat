package com.cesieats.serviceuser.controller;

import com.cesieats.serviceuser.config.JwtUtil;
import com.cesieats.serviceuser.dto.*;
import com.cesieats.serviceuser.entity.User;
import com.cesieats.serviceuser.exception.UserNotFoundException;
import com.cesieats.serviceuser.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(
        origins = "*",                      // Autorise toutes les origines
        allowedHeaders = {"Content-Type", "Authorization"}, // Autorise ces en-têtes
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        Optional<User> userOptional = userService.getUserByEmail(authRequest.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Vérification avec le passwordEncoder
            if (passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
                String token = jwtUtil.generateToken(user);
                return ResponseEntity.ok(new AuthResponse(token));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    @GetMapping("/me")
    public User getUser(@RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractUsername(token.substring(7));
        return userService.getUserByEmail(email).orElseThrow();
    }

    @PostMapping("/create")
    public User register(@Valid @RequestBody User user){
        return userService.saveUser(user);
    }

    @GetMapping("/users")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) throws UserNotFoundException {
        return userService.getUserById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));
    }

    @PutMapping("/update-profil/{id}")
    public UserDTO update(@PathVariable Long id, @Valid @RequestBody UserDTO userUpdated) throws UserNotFoundException { // http://localhost:port/user/update/125
        return userService.updateUser(id, userUpdated);
    }


    @PutMapping("/update-password/{id}")// Dans la requete update le json doit être avec newPassword et pas password car on point sur l'attribut du UserUpdatePassworDTO
    // TODO on verra par la suite si on crypt le message ou non
    public String updatePassword(@PathVariable Long id, @Valid @RequestBody UserUpdatePasswordDTO userUpdatedPassword) throws UserNotFoundException { // http://localhost:port/user/update/125
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
