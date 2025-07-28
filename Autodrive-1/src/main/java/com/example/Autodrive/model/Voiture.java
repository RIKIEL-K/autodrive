package com.example.Autodrive.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@AllArgsConstructor
@Data
@Document(collection = "voitures")
public class Voiture {
    @Id
    private String id;
    private String driverId;
    private String niv;
    private String numeroDePlaque;
    private int annee;
    private String marque;
    private String modele;
    private String couleur;
    private String classe;
}
