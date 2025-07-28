package com.example.Autodrive.repository;

import com.example.Autodrive.model.Token;
import com.example.Autodrive.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface TokenRepository extends MongoRepository<Token, String> {
    Token findByUser(User user);

    // Méthode pour vérifier si un token existe par son identifiant
    boolean existsById(String id);

    Token findByToken(String token);
}
