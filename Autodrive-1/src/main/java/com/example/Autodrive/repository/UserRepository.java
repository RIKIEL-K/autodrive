package com.example.Autodrive.repository;

import com.example.Autodrive.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;


// Un repository pour gérer les opérations CRUD sur la collection User dans MongoDB
public interface UserRepository extends MongoRepository<User, String> {
    boolean existsByEmail(String email);
    boolean existsById(String id);


    User findByEmail(String email);
}
