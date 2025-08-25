package com.example.Autodrive.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@AllArgsConstructor
@Document(collection = "transactions")
public class Transaction {
    @Id
    private String id;
    private String userId;

    private String depart;
    private String destination;
    private double distance;
    private String tarif;
    private double prix;
    private Date date;
}


