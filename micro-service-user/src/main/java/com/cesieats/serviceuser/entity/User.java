package com.cesieats.serviceuser.entity;

import com.cesieats.serviceuser.enums.Role;
import com.cesieats.serviceuser.enums.Status;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@Schema(description = "Représente un utilisateur de la plateforme CESI Eats.")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Identifiant unique de l'utilisateur", example = "1")
    private Long id;

    @Column(length = 50)
    @Schema(description = "Prénom de l'utilisateur", example = "Amine")
    private String firstName;

    @Column(length = 100)
    @Schema(description = "Nom de l'utilisateur", example = "DAAMOUCH")
    private String lastName;

    @Column(nullable = false, unique = true)
    @Schema(description = "Adresse email de l'utilisateur", example = "aminette@example.com", required = true)
    private String email;

    @Column(nullable = false)
    @Schema(description = "Mot de passe de l'utilisateur (haché)", example = "$2a$10$...")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Schema(description = "Rôle de l'utilisateur", example = "CLIENT")
    private Role role;

    @Column(length = 255,nullable = false)
    @Schema(description = "Adresse complète de l'utilisateur", example = "42 rue du bonheur")
    private String address;

    @Column(nullable = false)
    @Schema(description = "Code postal", example = "75000")
    private String postalCode;

    @Column(nullable = false)
    @Schema(description = "Ville", example = "Labège")
    private String city;

    @Column(nullable = false)
    @Schema(description = "Pays", example = "France")
    private String country;

    @Column(length = 15)
    @Schema(description = "Numéro de téléphone", example = "+33 6 12 34 56 78")
    private String phoneNumber;

    @Schema(description = "Latitude de l'utilisateur", example = "43.610769")
    private double latitude;

    @Schema(description = "Longitude de l'utilisateur", example = "3.876716")
    private double longitude;

    @Column(nullable = false)
    @Schema(description = "Date de création du compte", example = "2023-10-01T12:00:00Z")
    private String createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Schema(description = "Statut de l'utilisateur", example = "ACTIVE")
    private Status status;


    @Column(nullable = false, unique = true)
    @Schema(description = "Code de parrainage de l'utilisateur", example = "CODE123")
    private String codeParrainage;

}
