package com.example.Autodrive.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    private String userId;
    private String driverId;
    private String courseId;

    private String text;

    private String driverName;     // utile pour l'affichage
    private String destination;
    private LocalDateTime createdAt = LocalDateTime.now();
}
