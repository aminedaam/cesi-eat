package com.cesieats.serviceuser.controller;

import com.cesieats.serviceuser.config.JwtUtil;
import com.cesieats.serviceuser.entity.Parrainage;
import com.cesieats.serviceuser.exception.CodeParrainageAlreadyUsedException;
import com.cesieats.serviceuser.service.ParrainageService;
import com.cesieats.serviceuser.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/parrainages")
@AllArgsConstructor
public class ParrainageController {


    private final ParrainageService parrainageService;

    @PostMapping("/create")
    public ResponseEntity<Parrainage> createParrainage(@RequestBody Parrainage parrainage) throws CodeParrainageAlreadyUsedException {
        Parrainage saved = parrainageService.createParrainage(parrainage);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Parrainage>> getAllParrainages() {
        List<Parrainage> parrainages = parrainageService.getAllParrainages();
        return ResponseEntity.ok(parrainages);
    }


}
