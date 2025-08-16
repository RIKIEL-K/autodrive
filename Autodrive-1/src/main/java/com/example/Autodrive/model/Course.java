package com.example.Autodrive.model;

import com.example.Autodrive.Enums.CourseStatus;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    private String id;
    private String userId;
    private String driverId;
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint depart;

    private GeoJsonPoint destination;
    private String commentaire;
    private double distanceKm;
    private double prix;

    private LocalDateTime date;
    private CourseStatus status;


    // ces champs seront presents uniquement dans les réponses, pas dans la base de données
    @Transient
    private String vehicule;

    @Transient
    private String plaque;
}


