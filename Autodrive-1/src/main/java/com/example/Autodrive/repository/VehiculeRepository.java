package com.example.Autodrive.repository;


import com.example.Autodrive.model.Vehicule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehiculeRepository extends MongoRepository<Vehicule, String> {
    List<Vehicule> findByConducteurId(String conducteurId);

}
