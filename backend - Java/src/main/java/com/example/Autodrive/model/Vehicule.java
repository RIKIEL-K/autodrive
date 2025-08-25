package com.example.Autodrive.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@Document(collection = "vehicules")
public class Vehicule {
        @Id
        private String id;
        private String conducteurId;
        private String marque;
        private String modele;
        private int annee;
        private String plaque;
}
