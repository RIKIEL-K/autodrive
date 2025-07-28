package com.example.Autodrive.model;

import com.mongodb.client.model.geojson.Point;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "drivers")
public class Driver {
    @Id
    private String id;
    private String vehiculeId; // Référence vers document Vehicule
    @NotBlank(message = "Le prénom ne peut pas être vide")
    private String firstname;
    private String lastname;
    @NotBlank(message = "Le numéro de téléphone ne peut pas être vide")
    private String phoneNumber;
    @Indexed(unique = true)
    @NotBlank(message = "L'email ne peut pas être vide")
    @Email(message = "L'email doit être valide")
    private String email;
    @NotBlank(message = "L'adresse ne peut pas être vide")
    private String address;
    @NotBlank(message = "Le mot de passe ne peut pas être vide")
    @Size(min = 6, message = "Le mot de passe doit comporter au moins 6 caractères")
    private String password;
    private boolean enLigne = false;
    private String profilePhoto;
    private Role role;
    private Date dateNaissance;

    // Visibilité du compte (pour la fonctionnalité "rendre invisible")
    private boolean accountVisible = true;

    // Date de création du compte
    private Date createdAt = new Date();

    // Date de dernière modification
    private Date updatedAt = new Date();

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint location; // Position géographique du conducteur
}

