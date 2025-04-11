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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name ="User", description = "Opérations de gestion des utilisateurs")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;
    @PostMapping("/login")
    @Operation(summary = "Connexion utilisateur", description = "Permet à un utilisateur de se connecter en fournissant son email et mot de passe.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Identifiants de connexion de l'utilisateur",
                    required = true
            )
    )
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) throws UserNotFoundException {
        Optional<User> userOptional = userService.getUserByEmail(authRequest.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if(userOptional.get().getStatus().toString().equals(Status.SUSPENDED.toString())){
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
    @Operation(summary = "Récupérer les informations de l'utilisateur connecté", description = "Récupère les informations de l'utilisateur connecté à partir du token JWT.")
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
    @Operation(summary = "Créer un nouvel utilisateur", description = "Enregistre un nouvel utilisateur dans le système.")
    public ResponseEntity<User> register(@Valid @RequestBody User user) throws UserEmailUsedException, CodeParrainageAlreadyUsedException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.saveUser(user));
    }

    @GetMapping("/all")
    @Operation(summary = "Récupérer tous les utilisateurs", description = "Récupère la liste de tous les utilisateurs.")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un utilisateur par ID", description = "Récupère les informations d'un utilisateur en fonction de son ID.")
    public User getUserById(@PathVariable Long id) throws UserNotFoundException {
        return userService.getUserById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));
    }

    @GetMapping("/getByRole/{role}")
    public List<User> getUserByRole(@PathVariable String role) throws UserNotFoundException {
        return userService.getUserByRole(role);
    }
    @PutMapping("/update-profil/{id}")
    @Operation(summary = "Mettre à jour le profil utilisateur", description = "Met à jour les informations du profil d'un utilisateur.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Informations mises à jour de l'utilisateur",
                    required = true
            )
    )
    public ResponseEntity<String> update(@PathVariable Long id, @Valid @RequestBody UserDTO userUpdated) throws UserNotFoundException, UserEmailUsedException { // http://localhost:port/user/update/125
        User userModifier = userService.updateUser(id, userUpdated);
        return ResponseEntity.ok(jwtUtil.generateToken(userModifier));
    }




    @PutMapping("/update-password/{id}")
    @Operation(summary = "Mettre à jour le mot de passe utilisateur", description = "Met à jour le mot de passe d'un utilisateur.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Nouveau mot de passe de l'utilisateur",
                    required = true
            )
    )
    public ResponseEntity<String> updatePassword(@PathVariable Long id, @Valid @RequestBody UserUpdatePasswordDTO userUpdatedPassword) throws UserNotFoundException, InvalidPasswordException {
        // Dans la requete il faut que tu mettre newPassword et pas password si tu fais un appel API sur postman
        // Car on prend le newPassword dans le DTO !!!!!!
        userService.updatePassword(id, userUpdatedPassword);
        return ResponseEntity.ok("Mot de passe mis à jour");
    }

    @PutMapping("/update-role/{id}")
    @PreAuthorize("hasAuthority('ADMIN')") // Vérifie que l’utilisateur est bien ADMIN
    @Operation(summary = "Mettre à jour le rôle utilisateur", description = "Met à jour le rôle d'un utilisateur.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Nouveau rôle de l'utilisateur",
                    required = true
            )
    )
    public String updateUserRole(@PathVariable Long id, @Valid @RequestBody UserRoleUpdateDTO roleUpdateDTO) throws UserNotFoundException {
        userService.updateUserRole(id, roleUpdateDTO);
        return "Rôle mis à jour avec succès";
    }


    @DeleteMapping("/delete/{email}")
    @Operation(summary = "Supprimer un utilisateur", description = "Supprime un utilisateur en fonction de son adresse email.",
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Adresse email de l'utilisateur à supprimer",
            required = true
        )
    )
    public ResponseEntity delete(@RequestHeader("Authorization") String token,  @PathVariable String email) throws UserNotFoundException {
        String emailUser = jwtUtil.extractEmail(token.substring(7));
        String role = jwtUtil.extractRole(token.substring(7));
        User user = userService.getUserByEmail(email).get();

        if(role.equals(Role.SERVICE_COMMERCIAL.toString()) || role.equals(Role.ADMIN.toString())){
            if(user.getRole() == Role.CLIENT ||user.getRole() == Role.RESTAURATEUR || user.getRole() == Role.LIVREUR){
                userService.deleteUserByEmail(email);
                return ResponseEntity.ok()
                        .body("Utilisateur supprimé avec succès");
            }else{
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("vous ne pouvez pas supprimer un utilisateur avec un autre rôle que CLIENT/RESTAURATEUR/LIVREUR");
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

    @PutMapping("/update-status/{id}")
    @PreAuthorize("hasAuthority('SERVICE_COMMERCIAL')") // Vérifie que l’utilisateur est bien ADMIN
    @Operation(summary = "Mettre à jour le statut utilisateur", description = "Met à jour le statut d'un utilisateur.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Nouveau statut de l'utilisateur",
                    required = true
            )
    )
    public ResponseEntity<String> updateStatus(@PathVariable Long id, @RequestBody String status) throws UserNotFoundException {
        userService.updateStatus(id, status);
        return ResponseEntity.ok("Statut mis à jour avec succès");
    }
}
