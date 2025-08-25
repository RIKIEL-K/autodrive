package com.example.Autodrive.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "comptes")
public class Compte {
    @Id
    private String id_compte;
    private String userId;
    private Date dateCreation;
}
