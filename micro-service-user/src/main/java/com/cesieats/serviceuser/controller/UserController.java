package com.cesieats.serviceuser.controller;

import com.cesieats.serviceuser.config.JwtUtil;
import com.cesieats.serviceuser.dto.*;
import com.cesieats.serviceuser.entity.User;
import com.cesieats.serviceuser.enums.Role;
import com.cesieats.serviceuser.enums.Status;
import com.cesieats.serviceuser.exception.CodeParrainageAlreadyUsedException;
import com.cesieats.serviceuser.exception.InvalidPasswordException;
import com.cesieats.serviceuser.exception.UserEmailUsedException;
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
// @CrossOrigin(
//         origins = "*",                      // Autorise toutes les origines
//         allowedHeaders = {"Content-Type", "Authorization"}, // Autorise ces en-têtes
//         methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
// )
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) throws UserNotFoundException {
        Optional<User> userOptional = userService.getUserByEmail(authRequest.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if(userOptional.get().getStatus().toString().equals(Status.SUSPENDED)){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse("Utilisateur suspendu"));
            }
            // Vérification avec le passwordEncoder
            if (passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
                String token = jwtUtil.generateToken(user);
                return ResponseEntity.ok(new AuthResponse(token));
            }else{
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse("Mot de passe incorrect"));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse("Utilisateur ou mot de passe incorrect"));
    }
    @GetMapping("/me")
    public ResponseEntity<?> getUser(@RequestHeader("Authorization") String token) throws UserNotFoundException {
        // Extraire l'email du token
        String email = jwtUtil.extractEmail(token.substring(7));// pour supprimer le Bearer

        // Rechercher l'utilisateur par email
        Optional <User> userOpt = userService.getUserByEmail(email);
        if(userOpt.isPresent()){
            return ResponseEntity.ok(userOpt.get());
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé");
        }
    }

    @PostMapping("/create")
    public ResponseEntity<User> register(@Valid @RequestBody User user) throws UserEmailUsedException, CodeParrainageAlreadyUsedException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.saveUser(user));
    }

    @GetMapping("/all")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) throws UserNotFoundException {
        return userService.getUserById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));
    }

    @PutMapping("/update-profil/{id}")
    public ResponseEntity<String> update(@PathVariable Long id, @Valid @RequestBody UserDTO userUpdated) throws UserNotFoundException, UserEmailUsedException { // http://localhost:port/user/update/125
        User userModifier = userService.updateUser(id, userUpdated);
        return ResponseEntity.ok(jwtUtil.generateToken(userModifier));
    }


    @PutMapping("/update-password/{id}")
    public ResponseEntity<String> updatePassword(@PathVariable Long id, @Valid @RequestBody UserUpdatePasswordDTO userUpdatedPassword) throws UserNotFoundException, InvalidPasswordException {
        // Dans la requete il faut que tu mettre newPassword et pas password si tu fais un appel API sur postman
        // Car on prend le newPassword dans le DTO !!!!!!
        userService.updatePassword(id, userUpdatedPassword);
        return ResponseEntity.ok("Mot de passe mis à jour");
    }

    @PutMapping("/update-role/{id}")
    @PreAuthorize("hasAuthority('ADMIN')") // Vérifie que l’utilisateur est bien ADMIN
    public String updateUserRole(@PathVariable Long id, @Valid @RequestBody UserRoleUpdateDTO roleUpdateDTO) throws UserNotFoundException {
        userService.updateUserRole(id, roleUpdateDTO);
        return "Rôle mis à jour avec succès";
    }

    @DeleteMapping("/delete/{email}")
    public ResponseEntity delete(@RequestHeader("Authorization") String token,  @PathVariable String email) throws UserNotFoundException {
        String emailUser = jwtUtil.extractEmail(token.substring(7));
        String role = jwtUtil.extractRole(token.substring(7));
        User user = userService.getUserByEmail(email).get();

        if(role.equals(Role.SERVICE_COMMERCIAL.toString()) || role.equals(Role.ADMIN.toString())){
            if(user.getRole() == Role.CLIENT){
                userService.deleteUserByEmail(email);
                return ResponseEntity.ok()
                        .body("Utilisateur supprimé avec succès");
            }else{
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("vous ne pouvez pas supprimer un utilisateur avec un autre rôle que CLIENT");
            }
        }else if(!emailUser.equals(email)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("vous ne pouvez pas supprimer un autre utilisateur que vous même");
        }else{
            userService.deleteUserByEmail(email);
            return ResponseEntity.ok()
                    .body("Utilisateur supprimé avec succès");
        }
    }

}
