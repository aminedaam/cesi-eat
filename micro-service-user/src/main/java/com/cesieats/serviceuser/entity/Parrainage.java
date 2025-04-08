package com.cesieats.serviceuser.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "parrainages")
@Getter
@Setter
@NoArgsConstructor
public class Parrainage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // L'utilisateur parrainé
    @OneToOne
    @JoinColumn(name = "parraine_id", nullable = false, unique = true)
    private User utilisateurParraine;

    // Le parrain (celui qui a partagé son code)
    @ManyToOne
    @JoinColumn(name = "parrain_id", nullable = false)
    private User parrain;

    // Indique si la réduction a été utilisée
    @Column(nullable = false)
    private boolean reductionUtilisee = false;

}
