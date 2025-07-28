package com.example.Autodrive.repository;

import com.example.Autodrive.model.Compte;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CompteRepository extends MongoRepository<Compte, String> {

}
