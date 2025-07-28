package com.example.Autodrive.repository;


import com.example.Autodrive.model.Voiture;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface VoitureRepository extends MongoRepository<Voiture, String> {
    Optional<Voiture> findByDriverId(String driverId);
    boolean existsByDriverId(String driverId);
}

