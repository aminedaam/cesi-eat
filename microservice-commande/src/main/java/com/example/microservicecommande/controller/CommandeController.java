package com.example.microservicecommande.controller;

import com.example.microservicecommande.entity.Commande;
import com.example.microservicecommande.exception.CommandeNotFoundException;
import com.example.microservicecommande.services.CommandeService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/commandes")
@AllArgsConstructor
public class CommandeController {

    private final CommandeService commandeService;

    @PostMapping("/create")
    public ResponseEntity<String> createCommande(@Valid @RequestBody Commande commande) {
        commandeService.createCommande(commande);
        return ResponseEntity.ok("Commande created successfully");
    }
    @PutMapping("/update/{commandeId}")
    public ResponseEntity<String> updateCommande(@PathVariable String commandeId,@Valid @RequestBody Commande updated) throws CommandeNotFoundException {
        commandeService.updateCommande(commandeId,updated);
        return ResponseEntity.ok("Commande updated successfully");
    }
    @PutMapping("/update-status/{commandeId}")
    public ResponseEntity<String> updateCommandeStatus(@PathVariable String commandeId, @RequestBody String status) throws CommandeNotFoundException {
        commandeService.updateCommandeStatus(commandeId, status);
        return ResponseEntity.ok("Commande status updated successfully");
    }

    @DeleteMapping("/delete/{commandeId}")
    public ResponseEntity<String> deleteCommande(@PathVariable String commandeId) throws CommandeNotFoundException {
        commandeService.deleteCommande(commandeId);
        return ResponseEntity.ok("Commande deleted successfully");
    }

    @GetMapping("/get/{commandeId}")
    public ResponseEntity<Commande> getCommandeById(@PathVariable String commandeId) throws CommandeNotFoundException {
        Commande commande = commandeService.getCommandeById(commandeId);
        return ResponseEntity.ok(commande);
    }
    @GetMapping("/getAll")
    public ResponseEntity<List<Commande>> getAllCommandes() {
        List<Commande> commandes = commandeService.getAllCommandes();
        return ResponseEntity.ok(commandes);
    }
    @GetMapping("/getAllByRestaurantId/{restaurantId}")
    public ResponseEntity<List<Commande>> getAllCommandesByRestaurantId(@PathVariable Long restaurantId) {
        List<Commande> commandes = commandeService.getAllCommandesByRestaurantId(restaurantId);
        return ResponseEntity.ok(commandes);
    }
    @GetMapping("/getAllByClientId/{clientId}")
    public ResponseEntity<List<Commande>> getAllCommandesByClientId(@PathVariable Long clientId) {
        List<Commande> commandes = commandeService.getAllCommandesByClientId(clientId);
        return ResponseEntity.ok(commandes);
    }

    @GetMapping("/getCommandesByStatus/{status}")
    public ResponseEntity<List<Commande>> getCommandesByStatus(@PathVariable String status) throws CommandeNotFoundException {
        List<Commande> commandes = commandeService.getCommandeByStatus(status);
        return ResponseEntity.ok(commandes);
    }

}
