package com.cesieats.serviceuser.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "parrainages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Parrainage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Identifiant unique du parrainage", example = "1")
    private Long id;

    // L'utilisateur parrainé
    @OneToOne
    @JoinColumn(name = "parraine_id", nullable = false, unique = true)
    @Schema(description = "L'utilisateur parrainé", example = "1")
    private User utilisateurParraine;

    // Le parrain (celui qui a partagé son code)
    @ManyToOne
    @JoinColumn(name = "parrain_id", nullable = false)
    @Schema(description = "L'utilisateur parrain", example = "1")
    private User parrain;

    // Indique si la réduction a été utilisée
    @Column(nullable = false)
    @Schema(description = "Indique si la réduction a été utilisée", example = "false")
    private boolean promotion = false;

    public Parrainage(User parrainne, User parrain, boolean promotion) {
        this.utilisateurParraine = parrainne;
        this.parrain = parrain;
        this.promotion = promotion;
    }
}
