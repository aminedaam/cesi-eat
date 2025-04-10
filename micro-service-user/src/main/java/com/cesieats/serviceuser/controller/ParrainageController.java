package com.cesieats.serviceuser.controller;

import com.cesieats.serviceuser.config.JwtUtil;
import com.cesieats.serviceuser.dto.ParrainageDto;
import com.cesieats.serviceuser.entity.Parrainage;
import com.cesieats.serviceuser.exception.CodeParrainageAlreadyUsedException;
import com.cesieats.serviceuser.exception.UserNotFoundException;
import com.cesieats.serviceuser.service.ParrainageService;
import com.cesieats.serviceuser.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parrainages")
@AllArgsConstructor
@Tag(name = "Parrainage", description = "Opérations de gestion des parrainages")
public class ParrainageController {


    private final ParrainageService parrainageService;

    @PostMapping("/create")
    @Operation(summary = "Créer un parrainage", description = "Crée une relation entre un utilisateur parrainé et son parrain."
    , security = @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<Parrainage> createParrainage(@RequestBody ParrainageDto parrainage) throws CodeParrainageAlreadyUsedException, UserNotFoundException {
        Parrainage saved = parrainageService.createParrainage(parrainage);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    @Operation(summary = "Récupérer tous les parrainages", description = "Récupère la liste de tous les parrainages.")
    public ResponseEntity<List<Parrainage>> getAllParrainages() {
        List<Parrainage> parrainages = parrainageService.getAllParrainages();
        return ResponseEntity.ok(parrainages);
    }

    @GetMapping("/parrainne/{idParrainne}")
    @Operation(summary = "Récupérer un parrainage par Id du parrainne", description = "Récupère un parrainage en fonction de l'ID du parrainne.")
    public ResponseEntity<Parrainage> getParrainageByIdParrainne(@PathVariable Long idParrainne) throws UserNotFoundException {
        Parrainage parrainage = parrainageService.findByParrainneId(idParrainne);
        return ResponseEntity.ok(parrainage);
    }
}
